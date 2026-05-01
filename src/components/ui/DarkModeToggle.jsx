import { useUIStore } from '../../store/useUIStore'
import { SunIcon, MoonIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useUIStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center"
      style={{ backgroundColor: darkMode ? '#4f6ef7' : '#e4e4e7' }}
    >
      <motion.div
        className="absolute w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center"
        animate={{ x: darkMode ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {darkMode
          ? <MoonIcon size={10} className="text-brand-500" />
          : <SunIcon size={10} className="text-amber-500" />
        }
      </motion.div>
    </button>
  )
}
