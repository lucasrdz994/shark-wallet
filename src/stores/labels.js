import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { useSessionStore } from './session'
import { doc, addDoc, getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

export const useLabelsStore = defineStore('labels', {
  state: () => {
    return {
      initials: ['Salidas', 'Viajes', 'Mercado'],
      items: []
    }
  },

  getters: {
    default: (state) => state.items.find((el) => el.default) || {}
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
      const colRef = collection(docRef, 'labels')
      // Query
      const q = query(colRef, orderBy('createdAt', 'desc'))
      const response = await getDocs(q)

      const arr = []
      response.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data()
        })
      })
      this.items = arr
    },

    async create(label) {
      try {
        const payload = { ...label }
        delete payload.id

        const { user } = useSessionStore()
        payload.createdAt = dayjs().toDate()
        const docRef = doc(db, 'users', user.uid)
        const colRef = collection(docRef, 'labels')

        const response = await addDoc(colRef, payload)

        this.items.unshift({ ...payload, id: response.id })
      } catch (error) {
        console.log(error)
      }
    }
  }
})
