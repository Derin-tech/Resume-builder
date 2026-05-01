import { useState, useEffect, useRef } from 'react'
import { suggestJobTitles } from '../../lib/claudeApi'
import { motion, AnimatePresence } from 'framer-motion'

export default function JobTitleSuggestions({ value, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (value.length < 3) { setSuggestions([]); setShow(false); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      const data = await suggestJobTitles(value)
      setSuggestions(data.titles || [])
      setShow(true)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timerRef.current)
  }, [value])

  if (!show || suggestions.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className="absolute z-50 w-full mt-1 bg-white border border-surface-200 rounded-xl shadow-paper overflow-hidden"
      >
        {suggestions.map((title, i) => (
          <button
            key={i}
            onMouseDown={() => { onSelect(title); setShow(false) }}
            className="w-full text-left px-3 py-2 text-xs text-surface-700 hover:bg-brand-50 hover:text-brand-700 transition-colors border-b border-surface-100 last:border-0"
          >
            {title}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
