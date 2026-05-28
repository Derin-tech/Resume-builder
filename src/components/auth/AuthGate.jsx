import { useAuthStore } from '../../store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../lib/firebase'
import { Loader2Icon, SparklesIcon, XIcon } from 'lucide-react'

export default function AuthGate({ children }) {
  const user = useAuthStore(state => state.user)
  const loading = useAuthStore(state => state.loading)
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const ERROR_MESSAGES = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/invalid-credential': 'Invalid email or password.',
  }

  async function handleGoogle() {
    setError('')
    setAuthLoading(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleEmail() {
    if (!email || !password) return
    setError('')
    setAuthLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
    } catch (e) {
      setError(ERROR_MESSAGES[e.code] || 'Something went wrong.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Still checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#000' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)' }}>
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <motion.div key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: '#4f6ef7' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Not signed in — show auth wall
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #000000 0%, #0d0d1a 50%, #000000 100%)' }}>

        {/* Background glow */}
        <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: '#4f6ef7', top: '20%', left: '30%' }} />
        <div className="absolute w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: '#a78bfa', bottom: '20%', right: '30%' }} />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          {/* Card */}
          <div className="rounded-3xl p-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}>

            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)', boxShadow: '0 0 40px rgba(79,110,247,0.4)' }}
              >
                <SparklesIcon size={24} className="text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {mode === 'signin' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {mode === 'signin'
                  ? 'Sign in to access your resume builder'
                  : 'Join and start building your resume'}
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl mb-4 transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              {/* Google G SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Email + Password */}
            <div className="space-y-3 mb-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                className="w-full py-3 px-4 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,110,247,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                className="w-full py-3 px-4 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,110,247,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-3 py-2 rounded-xl text-xs"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <button
              onClick={handleEmail}
              disabled={authLoading || !email || !password}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all mb-4"
              style={{
                background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)',
                opacity: authLoading || !email || !password ? 0.5 : 1,
                boxShadow: '0 8px 24px rgba(79,110,247,0.3)',
              }}
            >
              {authLoading
                ? <Loader2Icon size={16} className="animate-spin mx-auto" />
                : mode === 'signin' ? 'Sign In' : 'Create Account'
              }
            </button>

            {/* Mode toggle */}
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                className="font-medium"
                style={{ color: '#a78bfa' }}
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Back to landing */}
          <div className="text-center mt-4">
            <a href="/" className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              ← Back to home
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  // Signed in — show the actual builder
  return children
}
