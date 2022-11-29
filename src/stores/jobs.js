import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { onSnapshot, where, addDoc, doc, deleteDoc, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useSessionStore } from './session'

export const useJobsStore = defineStore('jobs', {
  state: () => {
    return {
      scheduled: [],
      reminders: []
    }
  },

  actions: {
    $collection () {
      return collection(db, 'jobs')
    },

    async getScheduled() {
      if (this.scheduled.length) return this.scheduled

      // References
      const { user } = useSessionStore()
      // Query
      const q = query(
        this.$collection(),
        where('createdBy', '==', user.uid),
        where('rules.scheduled', '==', true),
        orderBy('createdAt', 'desc')
      )
      
      onSnapshot(q, (querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        this.scheduled = items
      })
    },

    async create(record, rules) {
      try {
        // References
        const { user } = useSessionStore()

        const payload = {
          done: false,
          createdAt: dayjs().toDate(),
          createdBy: user.uid,
          rules,
          record
        }

        await addDoc(this.$collection(), payload)
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

  }
})
