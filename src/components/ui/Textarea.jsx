import React from 'react';

export default function Textarea({ label, id, error, helpText, rows = 4, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none ${error ? 'border-red-400' : ''} ${className || ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {helpText && !error && <p className="text-surface-400 text-xs mt-1">{helpText}</p>}
    </div>
  )
}
