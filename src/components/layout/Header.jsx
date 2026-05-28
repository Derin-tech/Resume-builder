import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, User as UserIcon, Loader2 as Loader2Icon, Printer as PrinterIcon, Shield as ShieldIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { signOutUser } from '../../lib/firebase';
import { useAutoSave } from '../../hooks/useAutoSave';
import AuthModal from '../auth/AuthModal';
import ExportButton from '../ui/ExportButton';
import DarkModeToggle from '../ui/DarkModeToggle';
import { useUIStore } from '../../store/useUIStore';
import CoverLetterGenerator from '../ai/CoverLetterGenerator';

export default function Header() {
  const { activeTemplate, setTemplate, isSaving, lastSaved } = useResumeStore();
  const { user } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const timeAgo = lastSaved ? (Date.now() - lastSaved < 60000 ? 'just now' : `${Math.floor((Date.now()-lastSaved)/60000)}m ago`) : '';
  const { darkMode } = useUIStore();

  useAutoSave();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-surface-200/50 bg-white/30 backdrop-blur-md rounded-t-[32px]">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-surface-900 tracking-tight">
          Welcome Back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
        </h1>
        <span className="text-xs text-surface-500 font-medium">Let's build your dream resume</span>
      </div>
      
      <div className="flex items-center gap-3">
        <select 
          value={activeTemplate}
          onChange={(e) => setTemplate(e.target.value)}
          className="hidden md:block bg-white border border-surface-200 text-surface-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
        </select>

        <button className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border bg-white shadow-sm transition-all ${isSaving ? 'border-amber-200 text-amber-600' : 'border-green-200 text-green-600'}`}>
          {isSaving ? (
            <><Loader2Icon size={12} className="animate-spin" /><span className="hidden md:inline ml-1">Saving...</span></>
          ) : (
            <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span><span className="hidden md:inline ml-1">Saved {timeAgo}</span></>
          )}
        </button>

        <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-surface-200 bg-white text-surface-700 hover:bg-surface-50 transition-all shadow-sm">
          <PrinterIcon size={14} /> Print
        </button>

        <DarkModeToggle />

        <CoverLetterGenerator />

        <ExportButton />

        {user?.email === 'derinjosesanjith@gmail.com' && (
          <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-all shadow-sm font-medium">
            <ShieldIcon size={14} /> Admin
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-2 bg-white border border-surface-200 rounded-full py-1 px-1 shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <button onClick={signOutUser} className="text-xs text-surface-500 hover:text-surface-800 pr-3 font-medium transition-colors">
              Sign out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center bg-brand-500 text-white hover:bg-brand-600 px-4 py-1.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden md:inline ml-1.5">Sign In</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
