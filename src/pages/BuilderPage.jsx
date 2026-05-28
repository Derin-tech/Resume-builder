import React from 'react';
import AppShell from '../components/layout/AppShell';
import EditorPane from '../components/layout/EditorPane';
import PreviewPane from '../components/layout/PreviewPane';
import ResumeChatBubble from '../components/ai/ResumeChatBubble';
import AuthGate from '../components/auth/AuthGate';

export default function BuilderPage() {
  return (
    <AuthGate>
      <AppShell>
        <EditorPane />
        <PreviewPane />
        <ResumeChatBubble />
      </AppShell>
    </AuthGate>
  );
}
