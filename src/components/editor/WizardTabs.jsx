import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, FileText as FileTextIcon, Briefcase as BriefcaseIcon, GraduationCap as GraduationCapIcon, Zap as ZapIcon, Sparkles as SparklesIcon, Target as TargetIcon } from 'lucide-react';
import ContactForm from './ContactForm';
import SummaryForm from './SummaryForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ResumeScorePanel from '../ai/ResumeScorePanel';
import ATSMatcher from '../ai/ATSMatcher';
import { useResumeStore } from '../../store/useResumeStore';

const TABS = [
  { id: 'contact',    label: 'Contact',    icon: UserIcon },
  { id: 'summary',    label: 'Summary',    icon: FileTextIcon },
  { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
  { id: 'education',  label: 'Education',  icon: GraduationCapIcon },
  { id: 'skills',     label: 'Skills',     icon: ZapIcon },
  { id: 'score',      label: 'Score',      icon: SparklesIcon },
  { id: 'ats',        label: 'ATS',        icon: TargetIcon }
];

function getTabCompletion(tabId, resumeData) {
  const { contact, summary, experience, education, skills } = resumeData;
  switch (tabId) {
    case 'contact': return !!(contact.fullName && contact.email && contact.phone);
    case 'summary': return summary?.trim().length > 50;
    case 'experience': return experience?.length > 0;
    case 'education': return education?.length > 0;
    case 'skills': return skills?.length >= 3;
    default: return false;
  }
}

export default function WizardTabs({ mobile }) {
  const [activeTab, setActiveTab] = useState('contact');
  const { resumeData } = useResumeStore();

  const activeIndex = TABS.findIndex(t => t.id === activeTab);
  const progress = ((activeIndex + 1) / TABS.length) * 100;

  const shouldAnimate = typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Removed renderActiveForm

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <motion.div 
        className={`flex border-b border-surface-200 bg-white sticky top-0 z-10 ${mobile ? 'overflow-x-auto scrollbar-none' : ''}`}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isComplete = getTabCompletion(tab.id, resumeData);
          return (
            <motion.button
              variants={{
                hidden: { opacity: 0, y: -8 },
                visible: { opacity: 1, y: 0 }
              }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-3 border-none bg-transparent cursor-pointer font-medium transition-all duration-200 relative whitespace-nowrap
                ${mobile ? 'px-4 text-[10px]' : 'flex-1 px-1 text-xs'}
                ${isActive ? 'text-brand-600' : 'text-surface-400 hover:text-surface-600'}
              `}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full"
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="h-0.5 bg-surface-100 w-full relative">
        <div 
          className="h-full bg-brand-500 transition-all duration-300 absolute top-0 left-0"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldAnimate ? { opacity: 0, x: 12 } : { opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldAnimate ? { opacity: 0, x: -12 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {activeTab === 'contact' && <ContactForm />}
            {activeTab === 'summary' && <SummaryForm />}
            {activeTab === 'experience' && <ExperienceForm />}
            {activeTab === 'education' && <EducationForm />}
            {activeTab === 'skills' && <SkillsForm />}
            {activeTab === 'score' && <ResumeScorePanel />}
            {activeTab === 'ats' && <ATSMatcher />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
