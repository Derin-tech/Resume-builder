import { useState } from 'react'
import Header from './Header'
import EditorPane from './EditorPane'
import PreviewPane from './PreviewPane'
import { EyeIcon, PencilIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppShell() {
  const [mobileView, setMobileView] = useState('editor')

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-50">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-14">
        
        {/* DESKTOP: both panes side by side */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <EditorPane />
          <PreviewPane />
        </div>

        {/* MOBILE: one pane at a time */}
        <div className="flex flex-col flex-1 overflow-hidden md:hidden">
          <AnimatePresence mode="wait">
            {mobileView === 'editor' ? (
              <motion.div
                key="editor"
                className="flex-1 overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <EditorPane mobile />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                className="flex-1 overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <PreviewPane mobile />
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE BOTTOM TAB BAR */}
          <div className="flex border-t border-surface-200 bg-white safe-area-pb">
            <button
              onClick={() => setMobileView('editor')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                ${mobileView === 'editor'
                  ? 'text-brand-600'
                  : 'text-surface-400'}`}
            >
              <PencilIcon size={18} />
              Edit
              {mobileView === 'editor' && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                ${mobileView === 'preview'
                  ? 'text-brand-600'
                  : 'text-surface-400'}`}
            >
              <EyeIcon size={18} />
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
