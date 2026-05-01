import React, { useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { motion } from 'framer-motion';
import { FileText as FileTextIcon } from 'lucide-react';
import ResumePreview from '../preview/ResumePreview';
import ColorThemePicker from '../ui/ColorThemePicker';

export default function PreviewPane({ mobile }) {
  const { resumeData, activeTemplate, setTemplate } = useResumeStore()
  
  const completionScore = useMemo(() => {
    const { contact, summary, experience, education, skills } = resumeData
    let score = 0
    if (contact.fullName?.trim()) score += 20
    if (contact.email?.trim()) score += 10
    if (summary?.trim()) score += 20
    if (experience.length > 0) score += 25
    if (education.length > 0) score += 15
    if (skills.length > 0) score += 10
    return score
  }, [resumeData])

  return (
    <div className={`
      flex flex-col overflow-hidden h-full
      ${mobile ? 'w-full bg-surface-100' : 'flex-1 bg-surface-100 border-l border-surface-200'}
    `}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-surface-100/90 backdrop-blur-sm border-b border-surface-200 px-4 md:px-6 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-surface-400 uppercase tracking-wide">
          {mobile ? 'Resume Preview' : 'Preview'}
        </span>
        
        {!mobile && (
          <div className="flex items-center gap-3">
            <div className="inline-flex bg-white border border-surface-200 rounded-lg p-0.5 gap-0.5">
              {['modern', 'classic', 'executive'].map(tpl => (
                <button key={tpl} onClick={() => setTemplate(tpl)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-200 capitalize
                    ${activeTemplate === tpl ? 'bg-brand-500 text-white shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
                  {tpl}
                </button>
              ))}
            </div>
            <ColorThemePicker />
          </div>
        )}
        
        {/* Completion meter — always visible */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-400">{completionScore}% complete</span>
          <div className="w-16 h-1.5 bg-surface-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completionScore}%`, backgroundColor: completionScore < 40 ? '#f97316' : completionScore < 80 ? '#eab308' : '#22c55e' }}
            />
          </div>
        </div>
      </div>

      {/* Paper — scales on mobile */}
      {completionScore === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <FileTextIcon size={48} className="text-surface-200 mb-4" />
          <p className="text-surface-400 font-medium">Start filling in your details</p>
          <p className="text-surface-300 text-sm mt-1">Your resume preview appears here in real time</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex justify-center py-6 px-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="shadow-paper rounded-sm bg-white origin-top"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={mobile ? {
                transform: 'scale(0.45)', // user explicitly asked for 0.45
                transformOrigin: 'top center',
                marginBottom: '-55%',
              } : {}}
            >
              <ResumePreview />
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
