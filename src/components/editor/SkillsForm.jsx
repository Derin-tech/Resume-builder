import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X as XIcon } from 'lucide-react';

const SUGGESTIONS = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'SQL', 'Git', 'Docker', 'AWS', 'Figma'];

export default function SkillsForm() {
  const { resumeData: { skills }, addSkill, removeSkill } = useResumeStore();
  const [inputValue, setInputValue] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  const shouldAnimate = typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleAddSkill = (skillToOverride = null) => {
    const rawVal = typeof skillToOverride === 'string' ? skillToOverride : inputValue;
    const trimmed = rawVal.replace(',', '').trim();
    if (trimmed) {
      if (skills.length >= 20) {
        setLimitReached(true);
        setTimeout(() => setLimitReached(false), 2000);
        return;
      }
      addSkill(trimmed);
      if (typeof skillToOverride !== 'string') {
        setInputValue('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === 'Backspace' && inputValue === '' && skills.length > 0) {
      removeSkill(skills[skills.length - 1].id);
    }
  };

  const remainingSuggestions = SUGGESTIONS.filter(
    (s) => !skills.some((skill) => skill.name.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-surface-900 mb-1">Skills</h2>
      <p className="text-xs text-surface-400 mb-5">Add up to 20 skills — press Enter or comma to add</p>

      <div className="border border-surface-200 rounded-xl p-3 min-h-[80px] flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all bg-white">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              layout={shouldAnimate}
              initial={shouldAnimate ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldAnimate ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-sm font-medium"
            >
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="text-brand-400 hover:text-brand-700 hover:bg-brand-100 rounded-full p-0.5 transition-colors focus:outline-none"
              >
                <XIcon size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <input
          type="text"
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-surface-900 placeholder:text-surface-400"
          placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add another..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {limitReached && (
        <p className="text-xs text-red-400 mt-2">Maximum of 20 skills reached</p>
      )}

      {remainingSuggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-surface-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-1.5">
            {remainingSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddSkill(suggestion)}
                className="text-xs bg-surface-100 hover:bg-brand-50 hover:text-brand-600 text-surface-500 rounded-full px-2.5 py-1 transition-colors focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
