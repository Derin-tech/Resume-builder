import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function fireConfetti() {
  const count = 200
  const defaults = { origin: { y: 0.7 } }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#4f6ef7', '#a78bfa'] })
  fire(0.2, { spread: 60, colors: ['#22c55e', '#4f6ef7'] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#a78bfa', '#f472b6'] })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#fbbf24', '#4f6ef7'] })
}

export default function ConfettiEffect() {
  return null
}
