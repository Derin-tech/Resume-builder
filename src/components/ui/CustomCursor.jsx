import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isText, setIsText] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const dotX = useSpring(mouseX, { damping: 50, stiffness: 800 })
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 800 })
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 200 })

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)

      const target = e.target
      const isButton = target.closest('button') || target.closest('a')
      const isInput = target.closest('input') || target.closest('textarea')
      setHovering(!!isButton)
      setIsText(!!isInput)
    }

    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full bg-brand-500"
          animate={{
            width: isText ? 2 : clicking ? 6 : 8,
            height: isText ? 20 : clicking ? 6 : 8,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full border-2 border-brand-500"
          animate={{
            width: hovering ? 48 : clicking ? 28 : isText ? 24 : 36,
            height: hovering ? 48 : clicking ? 28 : isText ? 36 : 36,
            opacity: visible ? (hovering ? 0.4 : 0.25) : 0,
            borderRadius: isText ? '3px' : '50%',
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>
    </>
  )
}
