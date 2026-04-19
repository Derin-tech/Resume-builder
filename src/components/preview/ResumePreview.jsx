import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

export default function ResumePreview() {
  const { resumeData, activeTemplate, accentColor } = useResumeStore();

  return (
    <div id="resume-preview-root" className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTemplate}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {activeTemplate === 'modern' ? (
            <ModernTemplate data={resumeData} accentColor={accentColor} />
          ) : activeTemplate === 'classic' ? (
            <ClassicTemplate data={resumeData} accentColor={accentColor} />
          ) : activeTemplate === 'executive' ? (
            <ExecutiveTemplate data={resumeData} accentColor={accentColor} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
