import React, { useState, useEffect } from 'react'
import { improveText } from '../../lib/claudeApi'
import { Sparkles as SparklesIcon, Loader2 as Loader2Icon, Check as CheckIcon, X as XIcon, RefreshCw as RefreshCwIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BeforeAfterSlider from './BeforeAfterSlider'

export default function AIWritingAssistant({ originalText, context, onAccept, onClose }) {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  useEffect(() => {
    handleImprove()
  }, [])

  async function handleImprove() {
    setStatus('loading')
    setResult(null)
    try {
      const data = await improveText(originalText, context)
      setResult(data)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-brand-200 rounded-2xl shadow-float p-4 mt-2"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <SparklesIcon size={14} className="text-brand-500" />
          <span className="text-xs font-semibold text-brand-700">AI Writing Assistant</span>
        </div>
        <button onClick={onClose} className="text-surface-400 hover:text-surface-600">
          <XIcon size={14} />
        </button>
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 py-4 justify-center">
          <Loader2Icon size={16} className="animate-spin text-brand-500" />
          <span className="text-xs text-surface-500">Improving your text with Claude...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-3">
          <p className="text-xs text-red-500 mb-2">Something went wrong</p>
          <button onClick={handleImprove} className="text-xs text-brand-600 flex items-center gap-1 mx-auto hover:underline">
            <RefreshCwIcon size={12} /> Try again
          </button>
        </div>
      )}

      {status === 'done' && result && (
        <div className="space-y-3">
          <BeforeAfterSlider before={originalText} after={result.improved} />

          {result.changes && result.changes.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wide mb-1">What changed</p>
              {result.changes.map((change, i) => (
                <p key={i} className="text-[11px] text-surface-500 flex items-start gap-1.5 mb-0.5">
                  <span className="text-green-500 mt-0.5">✓</span>{change}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button 
              onClick={() => onAccept(result.improved)} 
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckIcon size={13} /> Use this version
            </button>
            <button 
              onClick={handleImprove} 
              className="px-3 py-2 border border-surface-200 text-surface-500 hover:text-surface-700 text-xs rounded-lg transition-colors"
            >
              <RefreshCwIcon size={13} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
