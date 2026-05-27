import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let app, auth, db, googleProvider

if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing! Please set VITE_FIREBASE_API_KEY environment variable.");
} else {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export const signInWithGoogle = () => auth ? signInWithPopup(auth, googleProvider) : Promise.reject("Firebase not initialized")
export const signInWithEmail = (email, password) => auth ? signInWithEmailAndPassword(auth, email, password) : Promise.reject("Firebase not initialized")
export const signUpWithEmail = (email, password) => auth ? createUserWithEmailAndPassword(auth, email, password) : Promise.reject("Firebase not initialized")
export const signOutUser = () => auth ? signOut(auth) : Promise.reject("Firebase not initialized")
export const onAuthChange = (callback) => auth ? onAuthStateChanged(auth, callback) : () => {}

export { auth, db }
