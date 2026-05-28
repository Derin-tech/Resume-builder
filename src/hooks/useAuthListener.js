import { useEffect } from 'react'
import { onAuthChange } from '../lib/firebase'
import { useAuthStore } from '../store/useAuthStore'
import { useResumeStore } from '../store/useResumeStore'
import { loadResume, initializeResume } from '../lib/firestoreService'

export function useAuthListener() {
  const setUser = useAuthStore(state => state.setUser)
  const setLoading = useAuthStore(state => state.setLoading)
  const loadFullResume = useResumeStore(state => state.loadFullResume)

  useEffect(() => {
    let unsubscribe = () => {}
    try {
      unsubscribe = onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          })
          
          // Initialize user record on first sign-in
          await initializeResume(firebaseUser.uid, firebaseUser.email)
          
          const result = await loadResume(firebaseUser.uid)
          if (result.success && result.data) {
            loadFullResume(result.data)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })
    } catch (e) {
      console.warn('Auth listener failed — Firebase config not set:', e.message)
      setLoading(false)
    }
    return () => unsubscribe()
  }, [])
}
