import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('typing')
  const [displayText, setDisplayText] = useState('')
  const [showTagline, setShowTagline] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const fullText = 'Resume Buddy'

  useEffect(() => {
    let i = 0
    const typeInterval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => setShowTagline(true), 300)
        setTimeout(() => setShowExit(true), 1400)
        setTimeout(() => onComplete(), 2400)
      }
    }, 90)
    return () => clearInterval(typeInterval)
  }, [])

  return (
    <AnimatePresence>
      {!showExit ? (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#f4f5f7] dark:bg-[#0a0a0f]"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated background orbs for soft lighting */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-brand-400"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 bg-indigo-500 translate-x-20 translate-y-20"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-400 to-indigo-500 blur-xl opacity-40 rounded-3xl" />
              <div className="relative w-24 h-24 bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[32px] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-500 to-indigo-600 font-bold text-5xl" style={{ fontFamily: 'Playfair Display, serif' }}>R</span>
              </div>
            </motion.div>

            {/* Typing text */}
            <div className="relative h-16 flex items-center">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-surface-900 tracking-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {displayText}
                <motion.span
                  className="inline-block w-[2px] h-[0.9em] bg-brand-500 ml-1 align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.h1>
            </div>

            {/* Tagline */}
            <AnimatePresence>
              {showTagline && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 text-base text-surface-500 font-medium tracking-wide uppercase text-sm"
                >
                  Preparing your workspace...
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-1 bg-surface-200/50 rounded-full overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-brand-400 to-indigo-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
