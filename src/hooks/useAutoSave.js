import { useEffect, useRef } from 'react'
import { useResumeStore } from '../store/useResumeStore'
import { useAuthStore } from '../store/useAuthStore'
import { saveResume } from '../lib/firestoreService'

export function useAutoSave() {
  const resumeData = useResumeStore(state => state.resumeData)
  const setIsSaving = useResumeStore(state => state.setIsSaving)
  const user = useAuthStore(state => state.user)
  const timerRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!user) return

    if (timerRef.current) clearTimeout(timerRef.current)

    setIsSaving(true)

    timerRef.current = setTimeout(async () => {
      const result = await saveResume(user.uid, resumeData)
      if (result.success) {
        setIsSaving(false)
      } else {
        console.error('Auto-save failed:', result.error)
        setIsSaving(false)
      }
    }, 1500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resumeData])
}
