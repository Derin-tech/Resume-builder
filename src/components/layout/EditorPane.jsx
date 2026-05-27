import React from 'react';
import WizardTabs from '../editor/WizardTabs';

export default function EditorPane({ mobile }) {
  return (
    <div className={`
      flex h-full overflow-hidden flex-col
      ${mobile ? 'w-full' : 'w-[420px] flex-shrink-0'}
    `}>
      <WizardTabs mobile={mobile} />
    </div>
  )
}
