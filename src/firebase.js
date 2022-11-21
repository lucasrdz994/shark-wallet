import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'
import { firebaseKeys } from './keys/firebase'

// Initialize Firebase
const app = initializeApp(firebaseKeys)

export const auth = getAuth(app)

export const db = getFirestore(app)

export const messaging = getMessaging(app)
