import React from 'react';
import WizardTabs from '../editor/WizardTabs';

export default function EditorPane({ mobile }) {
  return (
    <div className={`
      bg-white border-r border-surface-200 flex flex-col overflow-hidden h-full glass-panel
      ${mobile ? 'w-full' : 'w-[420px] flex-shrink-0'}
    `}>
      <WizardTabs mobile={mobile} />
    </div>
  )
}
