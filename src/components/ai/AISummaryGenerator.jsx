import { useState } from 'react'
import { generateSummary } from '../../lib/aiApi'
import { useResumeStore } from '../../store/useResumeStore'
import { SparklesIcon, Loader2Icon, CheckIcon, RefreshCwIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AISummaryGenerator({ onAccept }) {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState('')
  const resumeData = useResumeStore(state => state.resumeData)

  async function handleGenerate() {
    setStatus('loading')
    try {
      const data = await generateSummary(resumeData)
      setResult(data.summary || '')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-3">
      {status === 'idle' && (
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-brand-300 rounded-xl text-xs font-medium text-brand-600 hover:bg-brand-50 transition-all"
        >
          <SparklesIcon size={13} />
          Generate summary with AI based on my experience
        </button>
      )}

      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-surface-500">
          <Loader2Icon size={14} className="animate-spin text-brand-500" />
          Claude is writing your summary...
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-400 text-center py-2">
          Failed. <button onClick={handleGenerate} className="underline">Try again</button>
        </p>
      )}

      <AnimatePresence>
        {status === 'done' && result && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-50 border border-brand-200 rounded-xl p-3 space-y-2"
          >
            <p className="text-[10px] font-semibold text-brand-600 uppercase tracking-wide flex items-center gap-1">
              <SparklesIcon size={10} /> AI Generated
            </p>
            <p className="text-xs text-surface-800 leading-relaxed">{result}</p>
            <div className="flex gap-2">
              <button
                onClick={() => { onAccept(result); setStatus('idle') }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-brand-500 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-brand-600 transition-colors"
              >
                <CheckIcon size={12} /> Use this
              </button>
              <button
                onClick={handleGenerate}
                className="px-3 py-1.5 border border-surface-200 text-surface-500 text-xs rounded-lg hover:bg-surface-50"
              >
                <RefreshCwIcon size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
