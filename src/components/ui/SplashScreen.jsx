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
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-20 blur-3xl"
                style={{
                  width: `${200 + i * 80}px`,
                  height: `${200 + i * 80}px`,
                  background: i % 2 === 0 ? '#4f6ef7' : '#a78bfa',
                  left: `${10 + i * 15}%`,
                  top: `${10 + (i % 3) * 25}%`,
                }}
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -30, 20, 0],
                  scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.6, 0.1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center shadow-float"
              style={{ boxShadow: '0 0 40px rgba(79,110,247,0.6)' }}>
              <span className="text-white font-bold text-3xl">R</span>
            </div>
          </motion.div>

          {/* Typing text */}
          <div className="relative">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayText}
              <motion.span
                className="inline-block w-[3px] h-[1em] bg-brand-400 ml-1 align-middle"
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
                className="mt-4 text-lg text-white/50 font-light tracking-wide"
              >
                Build resumes that get you hired ✦
              </motion.p>
            )}
          </AnimatePresence>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-brand-400 rounded-full"
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
