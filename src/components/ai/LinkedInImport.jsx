import { useState, useRef } from 'react'
import { parseLinkedInPDF } from '../../lib/claudeApi'
import { useResumeStore } from '../../store/useResumeStore'
import { Loader2 as Loader2Icon, Check as CheckIcon, X as XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

export default function LinkedInImport() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const fileInputRef = useRef(null)

  const resumeData = useResumeStore(state => state.resumeData)
  const loadFullResume = useResumeStore(state => state.loadFullResume)

  async function handleImport() {
    if (!file) return
    setStatus('loading')
    
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1] // Extract base64 part
        
        try {
          const parsed = await parseLinkedInPDF(base64Data)
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
            setTimeout(() => { setOpen(false); setStatus('idle'); setFile(null) }, 1500)
          } else {
            setStatus('error')
          }
        } catch {
          setStatus('error')
        }
      }
      reader.readAsDataURL(file)
    } catch {
      setStatus('error')
    }
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
    } else {
      alert("Please upload a valid PDF file.")
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

              <p className="text-sm text-surface-500 mb-6 leading-relaxed">
                Go to your LinkedIn profile → click <strong>"More"</strong> → <strong>"Save to PDF"</strong>, then upload the PDF document here. We'll extract your information automatically.
              </p>

              <div 
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer mb-6
                  ${file ? 'border-brand-500 bg-brand-50' : 'border-surface-300 hover:border-brand-400 hover:bg-surface-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="application/pdf" 
                  className="hidden" 
                />
                
                {file ? (
                  <>
                    <CheckIcon size={32} className="text-brand-500 mb-2" />
                    <p className="text-brand-600 font-medium text-center">{file.name}</p>
                    <p className="text-xs text-brand-400 mt-1">Click to change file</p>
                  </>
                ) : (
                  <>
                    <LinkedinIcon size={32} className="text-surface-400 mb-2" />
                    <p className="text-surface-600 font-medium text-center">Click to upload your LinkedIn PDF</p>
                    <p className="text-xs text-surface-400 mt-1">Accepts .pdf files only</p>
                  </>
                )}
              </div>

              <button
                onClick={handleImport}
                disabled={status === 'loading' || !file}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006097] disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-all shadow-sm"
              >
                {status === 'loading' && <Loader2Icon size={18} className="animate-spin" />}
                {status === 'done' && <CheckIcon size={18} />}
                {status === 'idle' ? 'Import from PDF' : status === 'loading' ? 'Importing Data...' : status === 'done' ? 'Successfully Imported!' : 'Try again'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
