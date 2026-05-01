import React from 'react';
import AppShell from '../components/layout/AppShell';
import EditorPane from '../components/layout/EditorPane';
import PreviewPane from '../components/layout/PreviewPane';
import ResumeChatBubble from '../components/ai/ResumeChatBubble';

export default function BuilderPage() {
  return (
    <AppShell>
      <EditorPane />
      <PreviewPane />
      <ResumeChatBubble />
    </AppShell>
  );
}
