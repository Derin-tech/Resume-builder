import { useState } from 'react'
import { parseLinkedInText } from '../../lib/aiApi'
import { useResumeStore } from '../../store/useResumeStore'
import { LinkedinIcon, Loader2Icon, CheckIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LinkedInImport() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const loadFullResume = useResumeStore(state => state.loadFullResume)
  const resumeData = useResumeStore(state => state.resumeData)

  async function handleImport() {
    if (!text.trim()) return
    setStatus('loading')
    try {
      const parsed = await parseLinkedInText(text)
      if (parsed) {
        const merged = {
          ...resumeData,
          contact: { ...resumeData.contact, ...parsed.contact },
          summary: parsed.summary || resumeData.summary,
          experience: parsed.experience?.length ? parsed.experience.map(e => ({ ...e, id: crypto.randomUUID() })) : resumeData.experience,
          education: parsed.education?.length ? parsed.education.map(e => ({ ...e, id: crypto.randomUUID() })) : resumeData.education,
          skills: parsed.skills?.length ? parsed.skills.map(s => ({ ...s, id: crypto.randomUUID() })) : resumeData.skills,
        }
        loadFullResume(merged)
        setStatus('done')
        setTimeout(() => { setOpen(false); setStatus('idle'); setText('') }, 1500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-[#0077b5] hover:text-[#006097] border border-[#0077b5]/30 hover:border-[#0077b5] rounded-lg px-3 py-1.5 transition-all"
      >
        <LinkedinIcon size={13} />
        Import from LinkedIn
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-6 z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <LinkedinIcon size={18} className="text-[#0077b5]" />
                  <h3 className="font-semibold text-surface-900">Import from LinkedIn</h3>
                </div>
                <button onClick={() => setOpen(false)}>
                  <XIcon size={18} className="text-surface-400" />
                </button>
              </div>

              <p className="text-xs text-surface-500 mb-3 leading-relaxed">
                Go to your LinkedIn profile → click "More" → "Save to PDF", then copy and paste all the text here. Claude will extract your information automatically.
              </p>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your LinkedIn profile text here..."
                rows={8}
                className="w-full text-xs border border-surface-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-800"
              />

              <button
                onClick={handleImport}
                disabled={status === 'loading' || !text.trim()}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006097] disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                {status === 'loading' && <Loader2Icon size={14} className="animate-spin" />}
                {status === 'done' && <CheckIcon size={14} />}
                {status === 'idle' ? 'Import Profile' : status === 'loading' ? 'Importing...' : status === 'done' ? 'Imported!' : 'Try again'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
