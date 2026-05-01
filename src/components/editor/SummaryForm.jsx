import React from 'react';
import Textarea from '../ui/Textarea';
import { useResumeStore } from '../../store/useResumeStore';
import AISummaryGenerator from '../ai/AISummaryGenerator';

export default function SummaryForm() {
  const { resumeData: { summary }, updateSummary } = useResumeStore();

  const isOverLimit = summary.length > 600;

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-surface-900 mb-1">Professional Summary</h2>
      <p className="text-xs text-surface-400 mb-5">A 2–3 sentence snapshot of your career</p>

      <Textarea
        label="Summary"
        id="summary"
        rows={6}
        placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code and developer experience."
        value={summary}
        onChange={(e) => updateSummary(e.target.value)}
      />
      
      <AISummaryGenerator onAccept={(text) => updateSummary(text)} />
      
      <p className={`text-xs mt-2 text-right ${isOverLimit ? 'text-red-400' : 'text-surface-400'}`}>
        {summary.length} / 600 characters
      </p>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mt-4 space-y-1">
        <p className="text-xs font-semibold text-brand-700">Tips for a great summary</p>
        <p className="text-xs text-brand-600">&middot; Start with your professional title and years of experience</p>
        <p className="text-xs text-brand-600">&middot; Mention 2–3 core skills or areas of expertise</p>
        <p className="text-xs text-brand-600">&middot; End with what you're looking for or what you bring to a team</p>
      </div>
    </div>
  );
}
