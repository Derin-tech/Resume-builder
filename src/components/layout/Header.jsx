import React, { useState } from 'react';
import { FileText, User as UserIcon, Loader2 as Loader2Icon, Printer as PrinterIcon } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { signOutUser } from '../../lib/firebase';
import { useAutoSave } from '../../hooks/useAutoSave';
import AuthModal from '../auth/AuthModal';
import ExportButton from '../ui/ExportButton';

export default function Header() {
  const { activeTemplate, setTemplate, isSaving, lastSaved } = useResumeStore();
  const { user } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const timeAgo = lastSaved ? (Date.now() - lastSaved < 60000 ? 'just now' : `${Math.floor((Date.now()-lastSaved)/60000)}m ago`) : '';

  useAutoSave();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#1e293b] border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-brand-300" />
        <span className="font-semibold text-white">ResumeBuilder</span>
      </div>
      
      <div className="flex items-center gap-4">
        <select 
          value={activeTemplate}
          onChange={(e) => setTemplate(e.target.value)}
          className="bg-white/10 border-white/20 text-white rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="modern" className="text-black">Modern</option>
          <option value="classic" className="text-black">Classic</option>
        </select>

        <button className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${isSaving ? 'border-amber-400/50 text-amber-300' : 'border-green-400/50 text-green-300'}`}>
          {isSaving ? (
            <><Loader2Icon size={12} className="animate-spin" /> Saving...</>
          ) : (
            <><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> Saved {timeAgo}</>
          )}
        </button>

        <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all">
          <PrinterIcon size={14} /> Print
        </button>

        <ExportButton />

        {user ? (
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <button onClick={signOutUser} className="text-xs text-white/50 hover:text-white/80 transition-colors">
              Sign out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Sign In
          </button>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
