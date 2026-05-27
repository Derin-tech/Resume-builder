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
    <div className={`flex h-full w-full overflow-hidden ${mobile ? 'flex-col gap-2' : 'gap-6'}`}>
      {/* Sidebar */}
      <motion.div 
        className={`glass-card bg-white/70 flex flex-col justify-between py-6 ${mobile ? 'flex-row w-full overflow-x-auto scrollbar-none px-4 py-3 h-auto rounded-xl' : 'w-20 items-center h-full flex-shrink-0'}`}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {!mobile && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-8 shadow-[0_4px_12px_rgba(79,110,247,0.4)]">
            R
          </div>
        )}

        <div className={`flex ${mobile ? 'flex-row gap-4' : 'flex-col gap-6'} items-center`}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isComplete = getTabCompletion(tab.id, resumeData);
            return (
              <motion.button
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center transition-all duration-300
                  ${mobile ? 'w-10 h-10 rounded-full' : 'w-12 h-12 rounded-2xl'}
                  ${isActive ? 'bg-indigo-500 text-white shadow-[0_4px_15px_rgba(99,102,241,0.5)]' : 'bg-transparent text-surface-400 hover:text-surface-600 hover:bg-surface-100'}
                `}
                title={tab.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                
                {isComplete && !isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {!mobile && <div className="mt-auto">{/* Spacer */}</div>}
      </motion.div>

      {/* Main Content Area */}
      <div className={`glass-card bg-white/70 flex-1 flex flex-col overflow-hidden ${mobile ? 'rounded-xl border-none' : ''}`}>
        <div className="h-1 bg-surface-100 w-full relative">
          <div 
            className="h-full bg-gradient-to-r from-brand-400 to-indigo-500 transition-all duration-300 absolute top-0 left-0"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={shouldAnimate ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldAnimate ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <h2 className="text-2xl font-bold text-surface-900 mb-6">{TABS.find(t => t.id === activeTab)?.label}</h2>
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
    </div>
  );
}
