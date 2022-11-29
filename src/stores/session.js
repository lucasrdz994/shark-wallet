import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { collection, doc, writeBatch, updateDoc, arrayUnion, setDoc } from 'firebase/firestore'
import dayjs from 'dayjs'

import { useLabelsStore } from './labels'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      user: null
    }
  },

  getters: {
    isLoggedIn: (state) => Boolean(state.user),
    createdAt: (state) => (state.user ? new Date(Number(state.user.metadata.createdAt)) : null)
  },

  actions: {
    async createAccount(credentials) {
      try {
        const { email, password, name } = credentials
        const session = await createUserWithEmailAndPassword(auth, email, password)

        await updateProfile(auth.currentUser, { displayName: name })

        const userRef = doc(db, 'users', session.user.uid)

        await setDoc(userRef, {
          uid: session.user.uid,
          name,
          email
        })

        const batch = writeBatch(db)

        const labelsStore = useLabelsStore()

        for (const item of labelsStore.initials) {
          const label = {
            name: item,
            note: null,
            createdAt: dayjs().toDate(),
            visibility: ['income', 'expense']
          }
          batch.set(doc(collection(userRef, 'labels')), label)
        }

        await batch.commit()
      } catch (error) {
        console.log(error)
        throw error
      }
    },

    async login(credentials) {
      try {
        const { email, password } = credentials
        const session = await signInWithEmailAndPassword(auth, email, password)
        this.user = session.user
      } catch (error) {
        console.log('error', error)
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        console.log('error', error)
      }
    },

    async update(payload) {
      try {
        await updateProfile(auth.currentUser, payload)

        const docRef = doc(db, 'users', this.user.uid)
        await updateDoc(docRef, {
          name: payload.displayName
        })

        this.user = auth.currentUser
      } catch (error) {
        console.log('error', error)
      }
    },

    async appendFcmToken(token) {
      try {
        const docRef = doc(db, 'users', this.user.uid)
        await updateDoc(docRef, {
          fcmTokens: arrayUnion(token)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
})
