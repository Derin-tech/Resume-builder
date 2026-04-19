import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useSortable, SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { GraduationCap as GraduationCapIcon, GripVertical, Trash2, Plus } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

function EducationCard({ item, onUpdate, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayTitle = item.degree && item.institution 
    ? `${item.degree} at ${item.institution}`
    : item.degree || item.institution || 'New Education';

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
            {displayTitle}
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
        <Input
          label="Institution"
          id={`inst-${item.id}`}
          placeholder="MIT"
          value={item.institution}
          onChange={(e) => onUpdate(item.id, 'institution', e.target.value)}
        />
        <Input
          label="Degree"
          id={`deg-${item.id}`}
          placeholder="Bachelor of Science"
          value={item.degree}
          onChange={(e) => onUpdate(item.id, 'degree', e.target.value)}
        />
        <Input
          label="Field of Study"
          id={`field-${item.id}`}
          placeholder="Computer Science"
          value={item.fieldOfStudy}
          onChange={(e) => onUpdate(item.id, 'fieldOfStudy', e.target.value)}
        />
        <Input
          label="Graduation Year"
          id={`grad-${item.id}`}
          placeholder="2023"
          value={item.graduationYear}
          onChange={(e) => onUpdate(item.id, 'graduationYear', e.target.value)}
        />
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

export default function EducationForm() {
  const { resumeData: { education }, addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((item) => item.id === active.id);
      const newIndex = education.findIndex((item) => item.id === over.id);
      reorderEducation(arrayMove(education, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-surface-900 mb-1">Education</h2>
      <p className="text-xs text-surface-400 mb-5">Add your educational background</p>

      {education.length === 0 ? (
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3}} className="text-center py-10 px-4 border border-dashed border-surface-200 rounded-xl mb-4 bg-surface-50">
          <GraduationCapIcon size={36} className="text-surface-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-surface-500">No education added yet</p>
          <p className="text-xs text-surface-400 mt-1">Click below to add your first entry</p>
        </motion.div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={education.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {education.map((item) => (
                <motion.div layout key={item.id} initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8, height:0}} transition={{duration:0.2}}>
                  <EducationCard
                    item={item}
                    onUpdate={updateEducation}
                    onRemove={removeEducation}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      )}

      <Button variant="secondary" className="w-full mt-2" onClick={addEducation}>
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
