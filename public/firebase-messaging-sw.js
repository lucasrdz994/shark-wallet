importScripts('https://www.gstatic.com/firebasejs/9.9.4/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.9.4/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAtvjrky9wa-txtMsZs2ZPSoC6M4ggNziQ',
  authDomain: 'shark-wallet.firebaseapp.com',
  projectId: 'shark-wallet',
  storageBucket: 'shark-wallet.appspot.com',
  messagingSenderId: '685664263326',
  appId: '1:685664263326:web:c39ee83ceb0b98eb422f8f'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here for 'data' key
  let { data } = payload
  if (data && data.title && data.body) {
    const notificationTitle = data.title || 'Test title'
    const notificationOptions = {
      body: data.body || 'Test body'
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
  }
})
