import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../lib/firebase'
import { useAuthStore } from '../../store/useAuthStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { X as XIcon, Loader2 as Loader2Icon } from 'lucide-react'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      onClose()
    } catch (e) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEmail(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
      onClose()
    } catch (e) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/invalid-credential': 'Invalid email or password.',
      }
      setError(messages[e.code] || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <XIcon size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <Dialog.Title className="text-xl font-bold text-surface-900">
                  {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                </Dialog.Title>
                <p className="text-surface-500 text-sm mt-1">
                  {mode === 'signin' ? 'Sign in to access your saved resume' : 'Your resume will be saved automatically'}
                </p>
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-surface-200 rounded-xl py-2.5 px-4 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-all mb-4 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-surface-400">or continue with email</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input label="Email" id="auth-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <Input label="Password" id="auth-password" type="password" placeholder={mode === 'signin' ? 'Your password' : 'At least 6 characters'} value={password} onChange={e => setPassword(e.target.value)} />
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={handleEmail}
                  disabled={loading || !email || !password}
                >
                  {loading ? <Loader2Icon size={16} className="animate-spin mr-2" /> : null}
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </Button>
              </div>

              <p className="text-center text-xs text-surface-500 mt-4">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                  className="text-brand-600 font-medium hover:underline"
                >
                  {mode === 'signin' ? 'Create one' : 'Sign in'}
                </button>
              </p>

            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
