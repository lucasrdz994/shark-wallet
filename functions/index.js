const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.cronJobs = functions.pubsub
  // .schedule('28 17 * * *')
  .schedule('0 7 * * *')
  .timeZone('America/Buenos_Aires') // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    console.log('This will be run every day at 7:00 AM!', context)
    const today = new Date()

    const jobsRef = db.collection('jobs')
    
    const response = await jobsRef
      .where('done', '==', false)
      .where('rules.scheduled', '==', true)
      .where('rules.scheduledOn', '==', today.getDate())
      .get()

    const batch = db.batch()

    const notifications = []

    function createNotification(data, userRef) {
      // Todo. aca deberia estar la lógica para definir el titulo, body, icono, etc
      const notif = {
        title: 'Se agrego un nuevo registro programado',
        body: 'Un mensaje que no se que poner',
        createdAt: new Date(),
        read: false,
        data
      }
      const push = {
        notification: {
          title: '',
          body: '',
        },
        data: data,
        android:{
          icon: 'https://shark-wallet.web.app/images/icon.png'
        },
        webpush: {
          fcm_options: {
            link: 'https://shark-wallet.web.app/app/summary'
          }
        }
      }
      batch.set(userRef.collection('notifications').doc(), notif)
      notifications.push({ push, userRef })
    }

    for (const item of response.docs) {
      const data = item.data()
      const record = { ...data.record }
      record.createdAt = new Date()
      record.jobId = item.id

      const userRef = db.collection('users').doc(data.createdBy)
      const recordRef = userRef.collection('records').doc()
      batch.set(recordRef, record)

      createNotification(record, userRef)
    }

    // Guardo en Firestore
    await batch.commit()

    // Envio las Push
    const topic = (Math.random() + 1).toString(36).substring(7)
    for (const item of notifications) {
      const doc = await item.userRef.get()
      const tokens = doc.data().tokens

      await admin.messaging().subscribeToTopic(tokens, topic)

      const push = {
        topic: topic,
        webpush: {
          notification: {
            title: item.title,
            body: item.body,
            icon: '',
            image: ''
          },
          data: {
            record: JSON.stringify(item.data)
          }
        }
      }

      const response = await admin.messaging().send(push)
      console.log('Successfully sent message:', response)
      await admin.messaging().unsubscribeFromTopic(tokens, topic)
    }
    console.log('notifications', notifications)

    return null
  })
