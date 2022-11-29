import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { useSessionStore } from './session'
import { doc, addDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

export const useLabelsStore = defineStore('labels', {
  state: () => {
    return {
      initials: ['Salidas', 'Viajes', 'Mercado'],
      items: []
    }
  },

  getters: {
    default: (state) => {
      const label = state.items.find((el) => el.default)
      if (label) {
        return {
          id: label.id,
          name: label.name
        }
      }
      return {}
    }
  },

  actions: {
    $collection () {
      const { user } = useSessionStore()
      const docRef = doc(db, 'users', user.uid)
      return collection(docRef, 'labels')
    },

    async getAll() {
      if (this.items.length) return this.items

      const q = query(this.$collection(), orderBy('createdAt', 'desc'))
      onSnapshot(q, (querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        this.items = items
      })
    },

    async create(label) {
      try {
        const payload = { ...label }
        delete payload.id
        payload.createdAt = dayjs().toDate()

        await addDoc(this.$collection(), payload)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
