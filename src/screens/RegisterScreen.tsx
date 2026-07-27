import { useState, useRef } from 'react'
import { Eye, EyeOff, User, Phone, Lock, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import PakistanLocationSelect from '../components/PakistanLocationSelect'
import { useAuth } from '../contexts/AuthContext'
import {
  isValidEmail,
  isValidCnic,
  formatCnic,
  isAdult,
  isStrongEnoughPassword,
  getPasswordStrength,
  isValidPin,
} from '../lib/validation'
import { isValidPakistaniPhone } from '../lib/phone'

type FieldErrors = Partial<Record<
  'fullName' | 'fatherName' | 'email' | 'phone' | 'dob' | 'cnic' | 'province' | 'district' | 'tehsil' |
  'password' | 'confirmPassword' | 'pin' | 'trustedContact' | 'agree',
  string
>>

function InputField({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  rightSlot,
  maxLength,
}: {
  label: string
  icon: any
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  rightSlot?: React.ReactNode
  maxLength?: number
}) {
  return (
    <div>
      <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
        {label}
      </label>
      <div
        className="flex items-center gap-3 rounded-2xl border px-4"
        style={{ height: 52, background: '#FAFAFA', borderColor: error ? '#FCA5A5' : '#E5E7EB' }}
      >
        <Icon size={16} color="#9CA3AF" strokeWidth={1.8} />
        <input
          type={type}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[#111827]"
          style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
        />
        {rightSlot}
      </div>
      {error && (
        <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function RegisterScreen({ navigate, goBack }: NavProps) {
  const { register } = useAuth()

  const [fullName, setFullName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [cnic, setCnic] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [tehsil, setTehsil] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pinDigits, setPinDigits] = useState(['', '', '', ''])
  const [trustedContact, setTrustedContact] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  function validateStep1(): boolean {
    const next: FieldErrors = {}
    if (!fullName.trim()) next.fullName = 'Full name is required.'
    if (!fatherName.trim()) next.fatherName = 'This field is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!phone.trim()) next.phone = 'Phone number is required.'
    else if (!isValidPakistaniPhone(phone)) next.phone = 'Enter a valid number, e.g. 3001234567.'
    if (!dob) next.dob = 'Date of birth is required.'
    else if (!isAdult(dob)) next.dob = 'You must be at least 18 years old.'
    if (!cnic.trim()) next.cnic = 'CNIC is required.'
    else if (!isValidCnic(cnic)) next.cnic = 'CNIC must be 13 digits, e.g. 12345-1234567-1.'
    if (!province) next.province = 'Select a province.'
    if (!district) next.district = 'Select a district.'
    if (!tehsil) next.tehsil = 'Select a tehsil.'
    setErrors((prev) => ({
      ...prev,
      fullName: next.fullName,
      fatherName: next.fatherName,
      email: next.email,
      phone: next.phone,
      dob: next.dob,
      cnic: next.cnic,
      province: next.province,
      district: next.district,
      tehsil: next.tehsil,
    }))
    return Object.keys(next).length === 0
  }

  function validateStep2(): boolean {
    const next: FieldErrors = {}
    if (!password) next.password = 'Password is required.'
    else if (!isStrongEnoughPassword(password)) next.password = 'Use 8+ characters with upper, lower case letters and a number.'
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password.'
    else if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.'
    const pin = pinDigits.join('')
    if (pin.length > 0 && !isValidPin(pin)) next.pin = 'Enter all 4 digits.'
    if (trustedContact.trim() && !isValidPakistaniPhone(trustedContact)) next.trustedContact = 'Enter a valid number, e.g. 3001234567.'
    if (!agreed) next.agree = 'You must accept the Privacy Policy and Terms of Service.'
    setErrors((prev) => ({
      ...prev,
      password: next.password,
      confirmPassword: next.confirmPassword,
      pin: next.pin,
      trustedContact: next.trustedContact,
      agree: next.agree,
    }))
    return Object.keys(next).length === 0
  }

  function handlePinChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setPinDigits((prev) => {
      const copy = [...prev]
      copy[index] = digit
      return copy
    })
    if (digit && index < 3) pinRefs.current[index + 1]?.focus()
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  async function handlePrimaryButton() {
    if (step === 1) {
      if (validateStep1()) setStep(2)
      return
    }

    if (!validateStep2()) return

    setSubmitError('')
    setSubmitting(true)
    try {
      await register({
        fullName,
        fatherName,
        email,
        phone,
        cnic,
        dob,
        province,
        district,
        tehsil,
        password,
        emergencyPin: pinDigits.join('').length === 4 ? pinDigits.join('') : undefined,
        trustedContact: trustedContact.trim() || undefined,
      })
      navigate('dashboard')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const strength = getPasswordStrength(password)
  const strengthColors = ['#DC2626', '#F59E0B', '#F59E0B', '#10B981', '#10B981']

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      <div className="px-6 pt-4 pb-5">
        <button onClick={goBack} className="mb-4">
          <ChevronLeft size={22} color="#111827" />
        </button>

        <h1 className="text-[#111827]" style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
          Create Account
        </h1>
        <p className="text-[#6B7280] mt-1" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}>
          Step {step} of 2 · {step === 1 ? 'Personal Information' : 'Security Setup'}
        </p>

        {/* Progress */}
        <div className="flex gap-2 mt-4">
          <div className="h-1 flex-1 rounded-full bg-[#4F46E5]" />
          <div className={`h-1 flex-1 rounded-full ${step === 2 ? 'bg-[#4F46E5]' : 'bg-[#E5E7EB]'}`} />
        </div>
      </div>

      <div className="px-6 flex-1 overflow-y-auto">
        {submitError && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex gap-2 items-start" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <AlertCircle size={16} color="#DC2626" className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: 13, color: '#991B1B', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{submitError}</p>
          </div>
        )}

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <InputField
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
              value={fullName}
              onChange={setFullName}
              error={errors.fullName}
            />
            <InputField
              label="Father / Husband Name"
              icon={User}
              placeholder="Enter Name"
              value={fatherName}
              onChange={setFatherName}
              error={errors.fatherName}
            />
            <InputField
              label="Email Address"
              icon={User}
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />

            <div>
              <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Phone Number
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4" style={{ height: 52, background: '#FAFAFA', borderColor: errors.phone ? '#FCA5A5' : '#E5E7EB' }}>
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
              {errors.phone && (
                <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Date of Birth
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4" style={{ height: 52, background: '#FAFAFA', borderColor: errors.dob ? '#FCA5A5' : '#E5E7EB' }}>
                <input
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#6B7280]"
                  style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
              </div>
              {errors.dob && (
                <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{errors.dob}</p>
              )}
            </div>

            <div>
              <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                CNIC Number
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4" style={{ height: 52, background: '#FAFAFA', borderColor: errors.cnic ? '#FCA5A5' : '#E5E7EB' }}>
                <input
                  type="text"
                  value={cnic}
                  onChange={(e) => setCnic(formatCnic(e.target.value))}
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength={15}
                  className="flex-1 bg-transparent outline-none text-[#111827]"
                  style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
              </div>
              {errors.cnic && (
                <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{errors.cnic}</p>
              )}
            </div>

            <PakistanLocationSelect
              value={{ province, district, tehsil }}
              onChange={(location) => {
                setProvince(location.province)
                setDistrict(location.district)
                setTehsil(location.tehsil)
              }}
              errors={{ province: errors.province, district: errors.district, tehsil: errors.tehsil }}
            />

            <div className="bg-[#FEF3C7] rounded-2xl px-4 py-3 flex gap-3 items-start">
              <div className="w-4 h-4 mt-0.5 rounded-full bg-[#D97706] flex-shrink-0 flex items-center justify-center">
                <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>!</span>
              </div>
              <p style={{ fontSize: 12, color: '#92400E', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
                Your CNIC is required for legal document generation only. It is stored with end-to-end encryption.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Create Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4" style={{ height: 52, background: '#FAFAFA', borderColor: errors.password ? '#FCA5A5' : '#E5E7EB' }}>
                <Lock size={16} color="#9CA3AF" strokeWidth={1.8} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="flex-1 bg-transparent outline-none text-[#111827]"
                  style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
                </button>
              </div>
              {password && (
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= strength.score ? strengthColors[strength.score] : '#E5E7EB' }} />
                  ))}
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Confirm Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4" style={{ height: 52, background: '#FAFAFA', borderColor: errors.confirmPassword ? '#FCA5A5' : '#E5E7EB' }}>
                <Lock size={16} color="#9CA3AF" strokeWidth={1.8} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="flex-1 bg-transparent outline-none text-[#111827]"
                  style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-[#374151] mb-2" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Emergency PIN (4 digits) · Optional
              </label>
              <div className="flex gap-3">
                {pinDigits.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 h-14 rounded-xl border bg-[#FAFAFA] flex items-center justify-center"
                    style={{ borderColor: errors.pin ? '#FCA5A5' : '#E5E7EB' }}
                  >
                    <input
                      ref={(el) => { pinRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      value={d}
                      maxLength={1}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      className="w-full text-center bg-transparent outline-none text-[#111827]"
                      style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[#6B7280] mt-2" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Used for quick access in emergency situations
              </p>
              {errors.pin && (
                <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{errors.pin}</p>
              )}
            </div>

            {/* Trusted contact */}
            <InputField
              label="Trusted Contact (Optional)"
              icon={Phone}
              placeholder="3XX XXXXXXX"
              value={trustedContact}
              onChange={(v) => setTrustedContact(v.replace(/[^0-9]/g, '').slice(0, 10))}
              error={errors.trustedContact}
            />

            <button type="button" onClick={() => setAgreed(!agreed)} className="flex items-start gap-3 py-1 text-left">
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ borderColor: '#4F46E5', background: agreed ? '#4F46E5' : 'transparent' }}
              >
                {agreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span className="text-[#4F46E5] font-semibold">Privacy Policy</span> and{' '}
                <span className="text-[#4F46E5] font-semibold">Terms of Service</span>
              </p>
            </button>
            {errors.agree && (
              <p style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: -8 }}>{errors.agree}</p>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-5 border-t border-[#F3F4F6]">
        <button
          onClick={handlePrimaryButton}
          disabled={submitting}
          className="w-full rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
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
              Creating account...
            </>
          ) : (
            <>
              {step === 1 ? 'Next Step' : 'Create Account'}
              <ChevronRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
