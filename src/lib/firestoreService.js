import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const saveResume = async (uid, resumeData, email) => {
  try {
    const ref = doc(db, 'resumes', uid)
    await setDoc(ref, { 
      resumeData, 
      updatedAt: serverTimestamp(), 
      ownerEmail: email || '' 
    }, { merge: true })
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
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, { 
        resumeData: null,
        createdAt: serverTimestamp(), 
        updatedAt: serverTimestamp(), 
        ownerEmail: email || '' 
      })
    }
  } catch (error) {
    console.error('Error initializing resume:', error)
  }
}
