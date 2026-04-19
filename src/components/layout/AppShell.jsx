import React, { useState } from 'react';
import Header from './Header';
import { EyeIcon, XIcon } from 'lucide-react';

export default function AppShell({ children }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans">
      <Header />
      <main id="main-layout" className="pt-14 h-screen flex flex-col md:flex-row">
        {React.Children.map(children, child => {
          if (child.type.name === 'EditorPane') return <div className="editor-pane-mobile">{child}</div>
          if (child.type.name === 'PreviewPane') return <div className={`preview-pane-mobile ${previewOpen ? 'open' : ''}`}>{child}</div>
          return child;
        })}
      </main>

      <button
        onClick={() => setPreviewOpen(!previewOpen)}
        className="mobile-preview-btn fixed bottom-6 right-6 z-50 bg-brand-500 text-white rounded-full w-14 h-14 shadow-float items-center justify-center"
      >
        {previewOpen ? <XIcon size={22} /> : <EyeIcon size={22} />}
      </button>
    </div>
  );
}
