import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  const springConfig = { damping: 25, stiffness: 150 }
  const glowX = useSpring(mouseX, springConfig)
  const glowY = useSpring(mouseY, springConfig)

  const slowSpringConfig = { damping: 40, stiffness: 80 }
  const slowX = useSpring(mouseX, slowSpringConfig)
  const slowY = useSpring(mouseY, slowSpringConfig)

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <>
      {/* Fast small glow */}
      <motion.div
        className="fixed pointer-events-none z-[998] rounded-full"
        style={{
          width: 320,
          height: 320,
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(79,110,247,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Slow large glow */}
      <motion.div
        className="fixed pointer-events-none z-[997] rounded-full"
        style={{
          width: 600,
          height: 600,
          x: slowX,
          y: slowY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
        }}
      />
    </>
  )
}
