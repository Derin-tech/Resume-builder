import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const saveResume = async (uid, resumeData) => {
  try {
    const ref = doc(db, 'resumes', uid)
    await setDoc(ref, { resumeData, updatedAt: serverTimestamp(), ownerEmail: '' }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error saving resume:', error)
    return { success: false, error }
  }
}

export const loadResume = async (uid) => {
  try {
    const ref = doc(db, 'resumes', uid)
    const snapshot = await getDoc(ref)
    if (snapshot.exists()) {
      return { success: true, data: snapshot.data().resumeData }
    }
    return { success: true, data: null }
  } catch (error) {
    console.error('Error loading resume:', error)
    return { success: false, error }
  }
}

export const updateOwnerEmail = async (uid, email) => {
  try {
    const ref = doc(db, 'resumes', uid)
    await updateDoc(ref, { ownerEmail: email })
  } catch (error) {
    console.warn('Failed to update owner email:', error)
  }
}

export const initializeResume = async (uid, email) => {
  try {
    const ref = doc(db, 'resumes', uid)
    await setDoc(ref, { createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ownerEmail: email, resumeData: null }, { merge: true })
  } catch (error) {
    console.error('Error initializing resume:', error)
  }
}
