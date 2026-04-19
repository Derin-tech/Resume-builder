import { useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { exportToPDF } from '../../lib/pdfExport'
import { Download as DownloadIcon, Loader2 as Loader2Icon, Check as CheckIcon } from 'lucide-react'

export default function ExportButton({ className }) {
  const [status, setStatus] = useState('idle')
  const resumeData = useResumeStore(state => state.resumeData)
  const activeTemplate = useResumeStore(state => state.activeTemplate)
  const accentColor = useResumeStore(state => state.accentColor)

  async function handleExport() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      await exportToPDF({ ...resumeData, accentColor }, activeTemplate)
      setStatus('done')
      setTimeout(() => setStatus('idle'), 2500)
    } catch (e) {
      console.error('PDF export failed:', e)
      setStatus('idle')
    }
  }

  const configs = {
    idle: {
      icon: <DownloadIcon size={14} />,
      text: 'Export PDF',
      className: 'bg-brand-500 hover:bg-brand-600 text-white',
    },
    loading: {
      icon: <Loader2Icon size={14} className="animate-spin" />,
      text: 'Generating...',
      className: 'bg-brand-400 text-white cursor-not-allowed',
    },
    done: {
      icon: <CheckIcon size={14} />,
      text: 'Downloaded!',
      className: 'bg-green-500 text-white',
    },
  }

  const config = configs[status]

  return (
    <button
      onClick={handleExport}
      disabled={status !== 'idle'}
      className={`
        flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
        rounded-lg transition-all duration-200 ${config.className} ${className || ''}
      `}
    >
      {config.icon}
      {config.text}
    </button>
  )
}
