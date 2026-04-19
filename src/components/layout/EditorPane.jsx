import React from 'react';
import WizardTabs from '../editor/WizardTabs';

export default function EditorPane() {
  return (
    <div className="w-[420px] flex-shrink-0 bg-white border-r border-surface-200 flex flex-col overflow-hidden h-full">
      <WizardTabs />
    </div>
  )
}
