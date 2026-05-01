import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SplashScreen from './components/ui/SplashScreen'
import CursorGlow from './components/ui/CursorGlow'
import AnimatedBackground from './components/ui/AnimatedBackground'
import './index.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BuilderPage from './pages/BuilderPage'
import LoginPage from './pages/LoginPage'
import { useAuthListener } from './hooks/useAuthListener'
import { useResumeStore } from './store/useResumeStore'
import { useAuthStore } from './store/useAuthStore'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: 'red' }}>
          <h2>React crashed with this error:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

function AppWithAuth({ children }) {
  useAuthListener()
  const loading = useAuthStore(state => state.loading)
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    const name = useResumeStore.getState().resumeData.contact.fullName;
    document.title = name ? `${name} — ResumeBuilder` : 'ResumeBuilder';
    const unsub = useResumeStore.subscribe((state) => {
      const name = state.resumeData.contact.fullName;
      document.title = name ? `${name} — ResumeBuilder` : 'ResumeBuilder';
    });

    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        useResumeStore.getState().undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        useResumeStore.getState().redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      unsub()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div className="flex gap-1">
            {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{animationDelay: `${i*0.15}s`}} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Cursor glow — desktop only */}
      <div className="hidden md:block">
        <CursorGlow />
      </div>

      {/* Animated background */}
      <AnimatedBackground />

      {/* Splash screen */}
      {!splashDone && (
        <SplashScreen onComplete={() => setSplashDone(true)} />
      )}

      {/* App — fades in after splash */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppWithAuth>
          <Routes>
            <Route path="/" element={<BuilderPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AppWithAuth>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
