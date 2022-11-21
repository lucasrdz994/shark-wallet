import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import {
  doc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  getDocs,
  limit
} from 'firebase/firestore'
import { db } from '../firebase'
// Stores
import { useSessionStore } from './session'

export const useRecordsStore = defineStore('records', {
  state: () => {
    return {
      items: []
    }
  },

  getters: {},

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
      const colRef = collection(docRef, 'records')
      // Query
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(10))
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

    getLocally(id) {
      return this.items.find((el) => el.id === id) || null
    },

    async get(id) {
      try {
        const itemFound = this.getLocally(id)
        if (itemFound) return itemFound

        // References
        const { user } = useSessionStore()
        const docRef = doc(db, 'users', user.uid, 'records', id)
        const response = await getDoc(docRef)
        return {
          id: response.id,
          ...response.data()
        }
      } catch (error) {
        console.log(error)
      }
    },

    async create(record) {
      try {
        const payload = { ...record }

        delete payload.id
        // References
        const { user } = useSessionStore()
        payload.createdAt = dayjs().toDate()
        payload.confirmed = payload.type !== 'debt'
        delete payload.scheduled
        delete payload.scheduledOn

        const docRef = doc(db, 'users', user.uid)
        const colRef = collection(docRef, 'records')

        const response = await addDoc(colRef, payload)

        this.items.unshift({ ...payload, id: response.id })
      } catch (error) {
        console.log(error)
      }
    },

    async update(record) {
      try {
        const payload = { ...record }
        const recordId = payload.id
        delete payload.id
        // References
        const { user } = useSessionStore()
        const docRef = doc(db, 'users', user.uid, 'records', recordId)
        payload.updatedAt = dayjs().toDate()

        await updateDoc(docRef, payload)

        const index = this.items.findIndex((item) => item.id === recordId)
        if (index > -1) {
          this.items[index] = {
            ...payload,
            id: recordId
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async remove(id) {
      try {
        console.log(id)
        // References
        const { user } = useSessionStore()
        const docRef = doc(db, 'users', user.uid, 'records', id)

        await deleteDoc(docRef)

        this.items = this.items.filter((item) => item.id !== id)
      } catch (error) {
        console.log(error)
      }
    },

    async balance(date) {
      const from = dayjs(date).startOf('month').toDate()
      const to = dayjs(date).endOf('month').toDate()

      // References
      const { user } = useSessionStore()
      const docRef = doc(db, 'users', user.uid)
      const colRef = collection(docRef, 'records')
      // Query
      const q = query(
        colRef,
        where('createdAt', '>=', from),
        where('createdAt', '<=', to),
        orderBy('createdAt', 'desc')
      )
      const response = await getDocs(q)

      const arr = []
      response.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return arr
    },

    async debts() {
      try {
        // References
        const { user } = useSessionStore()
        const docRef = doc(db, 'users', user.uid)
        const colRef = collection(docRef, 'records')
        // Query
        const q = query(colRef, where('type', '==', 'debt'), where('confirmed', '==', false))
        const response = await getDocs(q)

        const arr = []
        response.forEach((doc) => {
          arr.push({
            id: doc.id,
            ...doc.data()
          })
        })
        return arr
      } catch (error) {
        console.log(error)
      }
    }
  }
})
