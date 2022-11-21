import { defineStore } from 'pinia'
import { getDocs, doc, collection, query, orderBy, limit } from 'firebase/firestore'
import { db, messaging } from '../firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { useSessionStore } from './session'

export const useNotificationsStore = defineStore('notifications', {
  state: () => {
    return {
      items: []
    }
  },

  getters: {
    count: (state) => state.items.length
  },

  actions: {
    listLocally() {
      return this.items.length ? this.items : null
    },

    async list() {
      const itemsFound = this.listLocally()
      if (itemsFound) return itemsFound

      // References
      const { user } = useSessionStore()
      const docRef = doc(db, 'users', user.uid)
      const colRef = collection(docRef, 'notifications')
      // Query
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(10))
      const response = await getDocs(q)
      console.log(response)
      const arr = []
      response.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data()
        })
      })
      this.items = arr
    },

    async handleFmcSubscription() {
      const token = await getToken(messaging, {
        vapidKey: 'BPJrlqDwlJPT-WbqZF6prH3JZlFwNV1M6hQp8itMQ33dQcEHmIO4Yj9QTtx_DpH5SydR31zP59MatmzUfkJ95y0'
      })
      if (token) {
        console.log('debo guardar el token', token)
        const sessionStore = useSessionStore()
        await sessionStore.appendFcmToken(token)

        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload)
          // ...
        })
      }
    },

    async init() {
      try {
        if (Notification) {
          if (Notification.permission === 'granted') {
            await this.handleFmcSubscription()
          } else {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
              console.log('Notification permission granted.')
              await this.handleFmcSubscription()
            }
          }
        } else {
          console.log('Notificaciones no permitidas en el dispositivo.')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})
