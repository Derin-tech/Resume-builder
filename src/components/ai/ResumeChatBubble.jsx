import { useState, useRef, useEffect } from 'react'
import { chatWithResume } from '../../lib/claudeApi'
import { useResumeStore } from '../../store/useResumeStore'
import { MessageCircleIcon, XIcon, SendIcon, Loader2Icon, SparklesIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const STARTER_QUESTIONS = [
  "What's missing from my resume?",
  "Make my summary more confident",
  "What skills should I add?",
  "Is my resume ATS-friendly?",
]

export default function ResumeChatBubble() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const resumeData = useResumeStore(state => state.resumeData)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text) {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    const userMsg = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const history = messages.map(m => ({ role: m.role, content: m.content }))
    const reply = await chatWithResume(msg, resumeData, history)

    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-brand-500 text-white rounded-full shadow-float flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: open ? '0 0 0 0 rgba(79,110,247,0)' : ['0 0 0 0 rgba(79,110,247,0.4)', '0 0 0 12px rgba(79,110,247,0)', '0 0 0 0 rgba(79,110,247,0)'] }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><XIcon size={22} /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><MessageCircleIcon size={22} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-surface-200"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-brand-500 flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon size={14} className="text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Resume Buddy AI</p>
                <p className="text-white/60 text-[10px]">Ask me anything about your resume</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-surface-400 text-center py-2">Try asking:</p>
                  {STARTER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-xs bg-surface-50 hover:bg-brand-50 hover:text-brand-700 text-surface-600 rounded-xl px-3 py-2 transition-colors border border-surface-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-brand-500 text-white rounded-br-none'
                      : 'bg-surface-100 text-surface-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-100 rounded-2xl rounded-bl-none px-3 py-2">
                    <div className="flex gap-1 items-center h-4">
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-surface-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-surface-100 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask Resume Buddy..."
                className="flex-1 text-xs bg-surface-50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 border border-surface-200"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-8 h-8 bg-brand-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center hover:bg-brand-600 transition-colors"
              >
                <SendIcon size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
