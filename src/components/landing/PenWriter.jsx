import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function PenWriter() {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      pathLength: 1,
      transition: { duration: 2.5, ease: 'easeInOut', delay: 0.5 }
    })
  }, [controls])

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Paper */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{
            rotateY: [-2, 2, -2],
            rotateX: [1, -1, 1],
            y: [0, -8, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Paper shadow */}
          <div className="absolute -bottom-4 left-4 right-4 h-full rounded-lg"
            style={{ background: 'rgba(79,110,247,0.15)', filter: 'blur(20px)', transform: 'translateZ(-10px)' }} />

          {/* Main paper */}
          <div className="relative bg-white rounded-lg overflow-hidden"
            style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)' }}>

            {/* Paper header bar */}
            <div className="h-8 flex items-center px-4 gap-2"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)' }}>
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
            </div>

            {/* Paper content */}
            <div className="p-6 space-y-3 font-resume" style={{ minHeight: '280px' }}>
              {/* Name line with writing animation */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-5 bg-surface-900 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(90deg, #1e293b, #334155)' }}
                />
              </div>

              {/* Contact line */}
              <motion.div
                className="h-2 rounded"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '80%', opacity: 0.3 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                style={{ background: '#94a3b8' }}
              />

              {/* Divider */}
              <motion.div
                className="h-0.5"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                style={{ background: 'linear-gradient(90deg, #4f6ef7, #a78bfa)', transformOrigin: 'left' }}
              />

              {/* Section title */}
              <motion.div
                className="h-2 rounded"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '30%', opacity: 0.6 }}
                transition={{ duration: 0.5, delay: 2.2 }}
                style={{ background: '#4f6ef7' }}
              />

              {/* Content lines */}
              {[0.4, 0.7, 0.5, 0.6].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${w * 100}%`, opacity: 0.2 }}
                  transition={{ duration: 0.4, delay: 2.5 + i * 0.15 }}
                  style={{ background: '#94a3b8' }}
                />
              ))}

              {/* Section 2 */}
              <motion.div
                className="h-2 rounded mt-2"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '25%', opacity: 0.6 }}
                transition={{ duration: 0.5, delay: 3.2 }}
                style={{ background: '#4f6ef7' }}
              />

              {[0.9, 0.6, 0.75].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${w * 100}%`, opacity: 0.2 }}
                  transition={{ duration: 0.4, delay: 3.5 + i * 0.15 }}
                  style={{ background: '#94a3b8' }}
                />
              ))}

              {/* Skill pills */}
              <motion.div
                className="flex gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.0 }}
              >
                {['React', 'Node.js', 'Python'].map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 4.0 + i * 0.1, type: 'spring' }}
                    className="px-2 py-0.5 rounded-full text-[8px] font-medium"
                    style={{ background: '#ede9fe', color: '#5b21b6' }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating pen */}
      <motion.div
        className="absolute"
        initial={{ x: -40, y: -20, opacity: 0 }}
        animate={{
          x: [0, 120, 200, 80, 0],
          y: [20, 60, 130, 180, 220],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 3.5, delay: 0.5, ease: 'easeInOut' }}
        style={{ top: '20%', left: '10%', zIndex: 10 }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <motion.path
            d="M30 5 L35 10 L15 30 L8 32 L10 25 Z"
            fill="url(#penGrad)"
            stroke="rgba(167,139,250,0.8)"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="penGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#4f6ef7" />
            </linearGradient>
          </defs>
          <circle cx="8" cy="32" r="1.5" fill="#a78bfa">
            <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>
    </div>
  )
}
