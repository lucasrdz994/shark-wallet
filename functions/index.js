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
  .schedule('28 17 * * *')
  // .schedule('0 7 * * *')
  .timeZone('America/Buenos_Aires') // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    console.log('This will be run every day at 7:00 AM!', context)
    const today = new Date()
    const jobsRef = db.collection('jobs')
    const snapshot = await jobsRef.where('done', '==', false).get()

    const batch = db.batch()

    const notificationsQueue = []
    function createNotification(data, userRef) {
      // Todo. aca deberia estar la lógica para definir el titulo, body, icono, etc
      const notification = {
        title: 'Se agrego un nuevo registro programado',
        body: 'Un mensaje que no se que poner',
        createdAt: new Date(),
        read: false,
        data
      }
      batch.set(userRef.collection('notifications').doc(), notification)
      notificationsQueue.push({ ...notification, userRef })
    }

    for (const item of snapshot.docs) {
      const data = item.data()
      const record = { ...data.record }
      record.createdAt = new Date()
      record.jobId = item.id

      // Documento del usuario actual
      const userRef = db.collection('users').doc(data.createdBy)

      // Registros programados
      if (data.scheduled) {
        if (data.scheduledOn === today.getDate()) {
          // Guardo el registro
          const recordRef = userRef.collection('records').doc()
          batch.set(recordRef, record)

          // Guardo la notificacion
          createNotification(record, userRef)
        }
      }

      // Recordatorios
      if (data.reminder) {
        if (data.reminderOn.toDate().toDateString() === today.toDateString()) {
          // Guardo la notificacion
          createNotification(record, userRef)

          if (!data.scheduled) {
            const jobRef = db.collection('jobs').doc(item.id)
            batch.update(jobRef, { done: true })
          }
        }
      }
    }

    // Guardo en Firestore
    await batch.commit()

    // Envio las Push
    for (const item of notificationsQueue) {
      const doc = await item.userRef.get()
      const tokens = doc.data().fcmTokens
      // Random topic name
      const tempTopic = Math.random().toString(36).slice(2)

      await admin.messaging().subscribeToTopic(tokens, tempTopic)

      const push = {
        topic: tempTopic,
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

      await admin.messaging().unsubscribeFromTopic(tokens, tempTopic)
      console.log('Successfully unsubscribe from tempTopic')
    }
    console.log('notifications', notificationsQueue)

    return null
  })
