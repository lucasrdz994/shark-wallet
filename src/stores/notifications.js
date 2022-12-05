import { defineStore } from 'pinia'
import { getDocs, doc, collection, query, orderBy, limit } from 'firebase/firestore'
import { db, messaging } from '../firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { useSessionStore } from './session'
import { vapidKey } from '../keys/firebase'

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
      // console.log(response)
      const arr = []
      response.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data()
        })
      })
      this.items = arr
    },

    async fcmSubscription() {
      const token = await getToken(messaging, { vapidKey })
      if (token) {
        const sessionStore = useSessionStore()
        await sessionStore.appendToken(token)

        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload)
          // ... TODO. recibo notificaciones
        })
      }
    },

    async init() {
      try {
        if (Notification) {
          if (Notification.permission === 'granted') {
            await this.fcmSubscription()
          } else {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
              await this.fcmSubscription()
            }
          }
        } else {
          console.log('Notificaciones no permitidas en el dispositivo.')
          // TODO. mostrar feedback
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})
