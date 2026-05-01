import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { Briefcase as BriefcaseIcon, GripVertical, Trash2, Plus, Sparkles as SparklesIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import AIWritingAssistant from '../ai/AIWritingAssistant';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import JobTitleSuggestions from '../ai/JobTitleSuggestions';

function ExperienceCard({ item, onUpdate, onRemove }) {
  const [showAI, setShowAI] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-surface-200 rounded-xl p-4 mb-3 space-y-3 ${
        isDragging ? 'shadow-float opacity-90 z-50 cursor-grabbing relative' : 'cursor-default'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <GripVertical size={16} className="text-surface-300" />
          <span className="font-medium text-sm text-surface-700">
            {item.jobTitle || 'New Experience'}
          </span>
        </div>
        <button 
          onClick={() => onRemove(item.id)}
          className="text-surface-300 hover:text-red-400 p-1 transition-colors relative z-10 hover:bg-surface-50 rounded"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="relative">
          <Input
            label="Job Title"
            id={`title-${item.id}`}
            placeholder="Senior Software Engineer"
            value={item.jobTitle}
            onChange={(e) => onUpdate(item.id, 'jobTitle', e.target.value)}
          />
          <JobTitleSuggestions value={item.jobTitle} onSelect={(title) => onUpdate(item.id, 'jobTitle', title)} />
        </div>
        <Input
          label="Company"
          id={`company-${item.id}`}
          placeholder="Acme Corp"
          value={item.company}
          onChange={(e) => onUpdate(item.id, 'company', e.target.value)}
        />
        <Input
          label="Location"
          id={`loc-${item.id}`}
          placeholder="New York, NY"
          value={item.location}
          onChange={(e) => onUpdate(item.id, 'location', e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            id={`start-${item.id}`}
            placeholder="Jan 2021"
            value={item.startDate}
            onChange={(e) => onUpdate(item.id, 'startDate', e.target.value)}
          />
          {item.current ? (
            <Input
              label="End Date"
              id={`end-${item.id}`}
              value="Present"
              disabled
              className="bg-surface-100 cursor-not-allowed"
              onChange={() => {}}
            />
          ) : (
            <Input
              label="End Date"
              id={`end-${item.id}`}
              placeholder="Dec 2023"
              value={item.endDate}
              onChange={(e) => onUpdate(item.id, 'endDate', e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id={`current-${item.id}`}
            checked={item.current}
            onChange={(e) => onUpdate(item.id, 'current', e.target.checked)}
            className="rounded border-surface-300 text-brand-500 focus:ring-brand-500 w-4 h-4 cursor-pointer"
          />
          <label htmlFor={`current-${item.id}`} className="text-xs text-surface-600 cursor-pointer">
            I currently work here
          </label>
        </div>

        <Textarea
          label="Key Achievements & Responsibilities"
          id={`desc-${item.id}`}
          rows={4}
          placeholder="• Led migration of legacy monolith to microservices, reducing deployment time by 60%&#10;• Mentored team of 4 junior engineers"
          value={item.description}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
        />
        <div className="flex justify-end mt-1">
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1 text-[11px] text-brand-500 hover:text-brand-700 font-medium transition-colors"
          >
            <SparklesIcon size={11} />
            {showAI ? 'Hide AI' : 'Improve with AI'}
          </button>
        </div>

        <AnimatePresence>
          {showAI && item.description && (
            <AIWritingAssistant
              originalText={item.description}
              context={`${item.jobTitle} at ${item.company}`}
              onAccept={(improved) => {
                onUpdate(item.id, 'description', improved)
                setShowAI(false)
              }}
              onClose={() => setShowAI(false)}
            />
          )}
          {showAI && !item.description && (
            <p className="text-xs text-surface-400 text-center py-2">Add a description first to use AI improvement</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

export default function ExperienceForm() {
  const { resumeData: { experience }, addExperience, updateExperience, removeExperience, reorderExperience } = useResumeStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = experience.findIndex((item) => item.id === active.id);
      const newIndex = experience.findIndex((item) => item.id === over.id);
      reorderExperience(arrayMove(experience, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-surface-900 mb-1">Work Experience</h2>
      <p className="text-xs text-surface-400 mb-5">Add your most recent positions first</p>

      {experience.length === 0 ? (
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3}} className="text-center py-10 px-4 border border-dashed border-surface-200 rounded-xl mb-4 bg-surface-50">
          <BriefcaseIcon size={36} className="text-surface-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-surface-500">No experience added yet</p>
          <p className="text-xs text-surface-400 mt-1">Click below to add your first position</p>
        </motion.div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {experience.map((item) => (
                <motion.div layout key={item.id} initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8, height:0}} transition={{duration:0.2}}>
                  <ExperienceCard
                    item={item}
                    onUpdate={updateExperience}
                    onRemove={removeExperience}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      )}

      <Button variant="secondary" className="w-full mt-2" onClick={addExperience}>
        <Plus className="w-4 h-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
}
