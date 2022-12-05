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
  limit,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'

// Stores
import { useSessionStore } from './session'

// Records Collection
// const { user } = useSessionStore()
// const docRef = doc(db, 'users', user.uid)
// const colRef = collection(docRef, 'records')

export const useRecordsStore = defineStore('records', {
  state: () => {
    return {
      latests: [],
      pendings: [],
      items: {}
    }
  },

  getters: {},

  actions: {
    $collection () {
      const { user } = useSessionStore()
      const docRef = doc(db, 'users', user.uid)
      return collection(docRef, 'records')
    },

    async getLatests() {
      if (this.latests.length) return this.latests
      const q = query(
        this.$collection(),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
      onSnapshot(q, (querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        this.latests = items
      })
    },

    async get(id) {
      try {
        const itemFound = this.latests.find(el => el.id === id)
        if (itemFound) return itemFound

        // References
        const docRef = doc(this.$collection(), id)
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
        // Sanitize params
        const payload = { ...record }
        delete payload.id
        payload.createdAt = dayjs().toDate()

        await addDoc(this.$collection(), payload)
      } catch (error) {
        console.log(error)
      }
    },

    async update(record) {
      try {
        const payload = { ...record }
        const recordId = payload.id
        delete payload.id
        payload.updatedAt = dayjs().toDate()
        // References
        const docRef = doc(this.$collection(), recordId)

        await updateDoc(docRef, payload)
      } catch (error) {
        console.log(error)
      }
    },

    async remove(id) {
      try {
        // References
        const docRef = doc(this.$collection(), id)
        await deleteDoc(docRef)
      } catch (error) {
        console.log(error)
      }
    },

    async confirm(id) {
      try {
        // References
        const docRef = doc(this.$collection(), id)
        await updateDoc(docRef, { pending: false })
      } catch (error) {
        console.log(error)
      }
    },

    async getBalance(date, fetchLocally = true) {
      console.log(date)
      const year = Number(date.at(0))
      const month = Number(date.at(1))
      date = dayjs().year(year).month(month - 1)

      if (fetchLocally && this.items[month]?.length) return this.items[month]

      const from = dayjs(date).startOf('month').toDate()
      const to = dayjs(date).endOf('month').toDate()

      // Query
      const q = query(
        this.$collection(),
        where('createdAt', '>=', from),
        where('createdAt', '<=', to),
        orderBy('createdAt', 'desc')
      )
      const response = await getDocs(q)

      const docs = response.docs.map(doc => {
        return { id: doc.id, ...doc.data() }
      })

      this.items[month] = docs

      return docs
    },

    async getPendings() {
      if (this.pendings.length) return this.pendings
      // Query
      const q = query(
        this.$collection(),
        where('pending', '==', false)
      )

      onSnapshot(q, (querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        this.pendings = items
      })
    }
  }
})
