import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { getDocs, where, addDoc, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useSessionStore } from './session'

export const useJobsStore = defineStore('jobs', {
  state: () => {
    return {
      items: []
    }
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
      const colRef = collection(db, 'jobs')
      // Query
      const q = query(colRef, where('createdBy', '==', user.uid), orderBy('createdAt', 'desc'))
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

    async create(job) {
      try {
        // References
        const { user } = useSessionStore()

        const payload = {
          done: false,
          createdAt: dayjs().toDate(),
          createdBy: user.uid,
          reminder: job.reminder,
          reminderOn: job.reminderOn,
          scheduled: job.scheduled,
          scheduledOn: job.scheduledOn,
          record: {
            amount: job.amount,
            label: job.label,
            note: job.note,
            type: job.type
          }
        }

        const response = await addDoc(collection(db, 'jobs'), payload)
        this.items.unshift({
          ...payload,
          id: response.id
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
})
