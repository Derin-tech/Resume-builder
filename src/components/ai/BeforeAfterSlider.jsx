import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function BeforeAfterSlider({ before, after }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  function handleMove(e) {
    if (!dragging.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100))
    setPosition(pct)
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden border border-surface-200 select-none h-48"
      onMouseMove={handleMove}
      onMouseUp={() => dragging.current = false}
      onMouseLeave={() => dragging.current = false}
      onTouchMove={handleMove}
      onTouchEnd={() => dragging.current = false}
    >
      {/* Before */}
      <div className="absolute inset-0 p-4 bg-red-50 overflow-hidden">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-2">Before</p>
        <p className="text-xs text-surface-600 leading-relaxed line-through decoration-red-300">{before}</p>
      </div>

      {/* After — clipped by position */}
      <div
        className="absolute inset-0 p-4 bg-green-50 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <p className="text-[10px] font-bold text-green-500 uppercase tracking-wide mb-2">After ✦</p>
        <p className="text-xs text-surface-700 leading-relaxed font-medium">{after}</p>
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize flex items-center justify-center"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        onMouseDown={() => dragging.current = true}
        onTouchStart={() => dragging.current = true}
      >
        <div className="w-6 h-6 bg-white border border-surface-200 rounded-full shadow-md flex items-center justify-center">
          <span className="text-[10px] text-surface-400">↔</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-3 text-[9px] font-bold text-red-400 uppercase">Original</div>
      <div className="absolute bottom-2 right-3 text-[9px] font-bold text-green-500 uppercase">Improved</div>
    </div>
  )
}
