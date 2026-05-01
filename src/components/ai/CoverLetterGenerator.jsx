import { useState } from 'react'
import { generateCoverLetter } from '../../lib/aiApi'
import { useResumeStore } from '../../store/useResumeStore'
import { FileTextIcon, Loader2Icon, CopyIcon, CheckIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CoverLetterGenerator() {
  const [open, setOpen] = useState(false)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [copied, setCopied] = useState(false)
  const resumeData = useResumeStore(state => state.resumeData)

  async function handleGenerate() {
    if (!jobDesc.trim()) return
    setStatus('loading')
    const data = await generateCoverLetter(resumeData, jobDesc)
    setResult(data)
    setStatus('done')
  }

  async function handleCopy() {
    if (result?.coverLetter) {
      await navigator.clipboard.writeText(result.coverLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-surface-600 hover:text-brand-600 border border-surface-200 hover:border-brand-300 rounded-lg px-3 py-1.5 transition-all"
      >
        <FileTextIcon size={13} />
        Cover Letter
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-4 bottom-4 top-16 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-surface-100">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                  <FileTextIcon size={16} className="text-brand-500" />
                  AI Cover Letter Generator
                </h3>
                <button onClick={() => setOpen(false)}>
                  <XIcon size={18} className="text-surface-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {status !== 'done' ? (
                  <>
                    <p className="text-xs text-surface-500">Paste the job description and Claude will write a tailored cover letter based on your resume.</p>
                    <textarea
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                      placeholder="Paste the job description here..."
                      rows={8}
                      className="w-full text-xs border border-surface-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={status === 'loading' || !jobDesc.trim()}
                      className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                    >
                      {status === 'loading'
                        ? <><Loader2Icon size={14} className="animate-spin" /> Writing your cover letter...</>
                        : <><FileTextIcon size={14} /> Generate Cover Letter</>
                      }
                    </button>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {result?.subject && (
                      <div className="bg-surface-50 rounded-xl p-3">
                        <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wide mb-1">Email Subject</p>
                        <p className="text-sm font-medium text-surface-800">{result.subject}</p>
                      </div>
                    )}
                    <div className="bg-white border border-surface-200 rounded-xl p-4">
                      <p className="text-sm text-surface-800 leading-relaxed whitespace-pre-line">{result?.coverLetter}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-surface-200 text-surface-700 text-xs font-medium py-2 rounded-xl hover:bg-surface-50 transition-colors"
                      >
                        {copied ? <><CheckIcon size={13} className="text-green-500" /> Copied!</> : <><CopyIcon size={13} /> Copy to clipboard</>}
                      </button>
                      <button
                        onClick={() => setStatus('idle')}
                        className="px-4 py-2 text-xs text-surface-500 border border-surface-200 rounded-xl hover:bg-surface-50"
                      >
                        Regenerate
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
