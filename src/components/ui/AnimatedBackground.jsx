import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Mesh gradient orbs — very subtle */}
      {[
        { color: '#4f6ef7', x: '10%',  y: '20%',  size: 500, duration: 12 },
        { color: '#a78bfa', x: '80%',  y: '10%',  size: 400, duration: 15 },
        { color: '#06b6d4', x: '60%',  y: '70%',  size: 350, duration: 10 },
        { color: '#4f6ef7', x: '20%',  y: '80%',  size: 300, duration: 18 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            backgroundColor: orb.color,
            opacity: 0.04,
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, #4f6ef7 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}
