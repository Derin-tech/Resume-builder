import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      darkMode: false,
      zoomLevel: 100,
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setZoomLevel: (level) => set({ zoomLevel: level }),
    }),
    { name: 'ui-preferences' }
  )
)
