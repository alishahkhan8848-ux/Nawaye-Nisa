import { useState } from 'react'
import { Eye, EyeOff, Lock, Phone, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import { useAuth } from '../contexts/AuthContext'
import { isValidPakistaniPhone } from '../lib/phone'

export default function LoginScreen({ navigate }: NavProps) {
  const { login, resetPassword } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [phone, setPhone] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleForgotPassword() {
    setError('')
    setInfo('')
    if (!isValidPakistaniPhone(phone)) {
      setError('Enter the phone number for your account above, then tap "Forgot Password?" again.')
      return
    }
    setResetting(true)
    try {
      const email = await resetPassword(phone)
      setInfo(`Password reset link sent to ${email}. Check your inbox.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset email. Please try again.')
    } finally {
      setResetting(false)
    }
  }

async function handleSignIn() {
  setError('')
  setSubmitting(true)

  setTimeout(() => {
    setSubmitting(false)
    console.log("Before navigate");
    navigate('dashboard')
    console.log("After navigate");
  }, 800)
}

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      {/* Top brand */}
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
          >
            <svg width="22" height="22" viewBox="0 0 52 52" fill="none">
              <path d="M26 8C26 8 14 16 14 28C14 34.627 19.373 40 26 40C32.627 40 38 34.627 38 28C38 16 26 8 26 8Z" fill="white" opacity="0.95" />
              <circle cx="26" cy="28" r="4" fill="#4F46E5" />
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Nawaye Nisa</span>
        </div>

        <h1
          className="text-[#111827]"
          style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Welcome back
        </h1>
        <p className="text-[#6B7280] mt-2" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}>
          Sign in to your secure account
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex flex-col gap-4 flex-1">
        {error && (
          <div className="rounded-2xl px-4 py-3 flex gap-2 items-start" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <AlertCircle size={16} color="#DC2626" className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: 13, color: '#991B1B', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{error}</p>
          </div>
        )}
        {info && (
          <div className="rounded-2xl px-4 py-3" style={{ background: '#ECFDF5', border: '1px solid #6EE7B7' }}>
            <p style={{ fontSize: 13, color: '#065F46', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{info}</p>
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
            Phone Number
          </label>
          <div
            className="flex items-center gap-3 rounded-2xl border px-4"
            style={{ height: 52, background: '#FAFAFA', borderColor: '#E5E7EB' }}
          >
            <div className="flex items-center gap-2 pr-3 border-r border-[#E5E7EB]">
              <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500 }}>🇵🇰 +92</span>
            </div>
            <Phone size={16} color="#9CA3AF" strokeWidth={1.8} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              placeholder="3XX XXXXXXX"
              className="flex-1 bg-transparent outline-none text-[#111827]"
              style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
            Password
          </label>
          <div
            className="flex items-center gap-3 rounded-2xl border px-4"
            style={{ height: 52, background: '#FAFAFA', borderColor: '#E5E7EB' }}
          >
            <Lock size={16} color="#9CA3AF" strokeWidth={1.8} />
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter password"
              className="flex-1 bg-transparent outline-none text-[#111827]"
              style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleForgotPassword}
              disabled={resetting}
              className="text-[#4F46E5]"
              style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Inter, -apple-system, sans-serif', opacity: resetting ? 0.6 : 1 }}
            >
              {resetting ? 'Sending...' : 'Forgot Password?'}
            </button>
          </div>
        </div>

        {/* Sign In */}
        <button
          onClick={handleSignIn}
          disabled={submitting}
          className="w-full rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95 mt-2"
          style={{
            height: 54,
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            fontSize: 16,
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontWeight: 600,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              TEST LOGIN
              <ChevronRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-[#9CA3AF]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>or</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        {/* Biometric - disabled for now; wiring to WebAuthn/platform biometrics is a separate phase */}
        <button
          disabled
          title="Biometric sign-in is coming in a future update"
          className="w-full rounded-2xl border border-[#E5E7EB] flex items-center justify-center gap-2 bg-[#FAFAFA] transition-all active:scale-95"
          style={{ height: 52, fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500, color: '#374151', opacity: 0.5, cursor: 'not-allowed' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8M16 4H18C19.1046 4 20 4.89543 20 6V8M20 16V18C20 19.1046 19.1046 20 18 20H16M8 20H6C4.89543 20 4 19.1046 4 18V16" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Sign in with Face ID
        </button>

        {/* Register */}
        <p className="text-center text-[#6B7280] mt-auto mb-4" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}>
          New to Nawaye Nisa?{' '}
          <button onClick={() => navigate('register')} className="text-[#4F46E5] font-semibold">
            Create Account
          </button>
        </p>
      </div>

      {/* Privacy note */}
      <div className="px-6 pb-6">
        <p className="text-center text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
          Your data is end-to-end encrypted and never shared without your consent
        </p>
      </div>
    </div>
  )
}
