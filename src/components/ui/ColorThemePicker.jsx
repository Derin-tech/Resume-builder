import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';

const THEMES = [
  { name: 'Indigo',  value: '#4f6ef7' },
  { name: 'Violet',  value: '#7c3aed' },
  { name: 'Rose',    value: '#e11d48' },
  { name: 'Teal',    value: '#0d9488' },
  { name: 'Amber',   value: '#d97706' },
  { name: 'Slate',   value: '#475569' },
];

export default function ColorThemePicker() {
  const { accentColor, setAccentColor } = useResumeStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-surface-500 font-medium">Theme</span>
      {THEMES.map(theme => (
        <button
          key={theme.value}
          onClick={() => setAccentColor(theme.value)}
          title={theme.name}
          className="w-5 h-5 rounded-full transition-transform hover:scale-110 border-2"
          style={{
            backgroundColor: theme.value,
            borderColor: accentColor === theme.value ? theme.value : 'transparent',
            boxShadow: accentColor === theme.value ? `0 0 0 2px white, 0 0 0 4px ${theme.value}` : 'none',
            transform: accentColor === theme.value ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );
}
