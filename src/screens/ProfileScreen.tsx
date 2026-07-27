import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Shield, Bell, Globe, HelpCircle, Info, LogOut, Lock, User, Calendar, Activity, Camera, X, Loader2, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import PakistanLocationSelect from '../components/PakistanLocationSelect'
import { useAuth } from '../contexts/AuthContext'
import { updateProfilePhoto, updatePersonalDetails, updateEmergencyContact } from '../firebase/userService'
import { getUserReports } from '../firebase/reports'
import { getEvidenceCount } from '../firebase/evidence'

function initialsFor(name: string | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?'
}

function displayPhone(fullPhone: string | undefined): string {
  if (!fullPhone) return ''
  // +923001234567 -> +92 300 1234567
  const digits = fullPhone.replace('+92', '')
  return `+92 ${digits.slice(0, 3)} ${digits.slice(3)}`
}

function localPhoneFrom(fullPhone: string | null | undefined): string {
  if (!fullPhone) return ''
  return fullPhone.replace('+92', '')
}

/** profile.createdAt is `unknown` (a Firestore Timestamp once loaded) — narrow it safely without `any`. */
function toDate(value: unknown): Date | null {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate()
  }
  return null
}

function formatMemberSince(value: unknown): string {
  const date = toDate(value)
  if (!date) return '—'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function daysActiveSince(value: unknown): number {
  const date = toDate(value)
  if (!date) return 0
  const diffMs = Date.now() - date.getTime()
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { profile, user, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState(profile?.fullName || '')
  const [fatherName, setFatherName] = useState(profile?.fatherName || '')
  const [dob, setDob] = useState(profile?.dob || '')
  const [location, setLocation] = useState({
    province: profile?.province || '',
    district: profile?.district || '',
    tehsil: profile?.tehsil || '',
  })
  const [emergencyContact, setEmergencyContact] = useState(localPhoneFrom(profile?.trustedContact))

  const [photoUrl, setPhotoUrl] = useState(profile?.profilePhotoUrl || null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setError('')
    setPhotoUploading(true)
    try {
      const url = await updateProfilePhoto(user.uid, file)
      setPhotoUrl(url)
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload your photo.')
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleSave() {
    if (!user) return
    setError('')
    setSaving(true)
    try {
      await updatePersonalDetails(user.uid, { fullName, fatherName, dob, ...location })
      await updateEmergencyContact(user.uid, emergencyContact)
      await refreshProfile()
      setSaved(true)
      setTimeout(onClose, 900)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-sm flex flex-col"
        style={{ maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F3F4F6] flex-shrink-0">
          <p style={{ fontSize: 16, fontWeight: 800, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Edit Profile</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F9FAFB] flex items-center justify-center">
            <X size={16} color="#6B7280" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Photo */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #312E81, #4F46E5)' }}>
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>{initialsFor(fullName)}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md"
                style={{ border: '1.5px solid #E5E7EB' }}
              >
                {photoUploading ? <Loader2 size={13} color="#4F46E5" className="animate-spin" /> : <Camera size={13} color="#4F46E5" strokeWidth={2} />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4" style={{ background: '#FEF2F2' }}>
              <AlertCircle size={14} color="#DC2626" strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#991B1B', fontFamily: 'Inter, -apple-system, sans-serif' }}>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border px-4 outline-none"
                style={{ height: 48, fontSize: 14, borderColor: '#E5E7EB', fontFamily: 'Inter, -apple-system, sans-serif' }}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Father's Name</label>
              <input
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full rounded-2xl border px-4 outline-none"
                style={{ height: 48, fontSize: 14, borderColor: '#E5E7EB', fontFamily: 'Inter, -apple-system, sans-serif' }}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-2xl border px-4 outline-none"
                style={{ height: 48, fontSize: 14, borderColor: '#E5E7EB', fontFamily: 'Inter, -apple-system, sans-serif' }}
              />
            </div>

            <PakistanLocationSelect value={location} onChange={setLocation} />

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Emergency / Trusted Contact</label>
              <div className="flex items-center rounded-2xl border px-4" style={{ height: 48, borderColor: '#E5E7EB' }}>
                <span style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', marginRight: 6 }}>+92</span>
                <input
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value.replace(/\D/g, ''))}
                  placeholder="3001234567"
                  className="flex-1 outline-none"
                  style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#F3F4F6] flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || photoUploading}
            className="w-full py-3.5 rounded-2xl text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: saved ? '#16A34A' : 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {saved ? 'Saved' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfileScreen({ navigate }: NavProps) {
  const { profile, user, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [stats, setStats] = useState({ reportsCreated: 0, evidenceUploaded: 0, aiAnalyses: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      if (!user) {
        setStatsLoading(false)
        return
      }
      setStatsLoading(true)
      try {
        const [reports, evidenceCount] = await Promise.all([getUserReports(user.uid), getEvidenceCount(user.uid)])
        if (cancelled) return
        setStats({
          reportsCreated: reports.length,
          evidenceUploaded: evidenceCount,
          aiAnalyses: reports.filter((r) => Boolean(r.aiSummary)).length,
        })
      } catch {
        // Non-fatal: leave stats at their last known (or zero) values rather than blocking the whole profile screen.
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    }

    loadStats()
    return () => {
      cancelled = true
    }
  }, [user])

  async function handleSignOut() {
    await logout()
    navigate('login')
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#F3F4F6]">
        <StatusBar />
        <div className="px-5 pt-2 pb-5">
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em', marginBottom: 16 }}>Profile</h1>

          {/* Profile card */}
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #312E81, #4F46E5)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile?.profilePhotoUrl ? (
                  <img src={profile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>{initialsFor(profile?.fullName)}</span>
                )}
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.01em' }}>{profile?.fullName || 'Loading...'}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, -apple-system, sans-serif' }}>{displayPhone(profile?.phone)}</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/25"
                style={{ fontSize: 12, fontWeight: 600, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                Edit
              </button>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>Identity Verified</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15">
                <Lock size={10} color="white" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Usage statistics */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4" style={{ border: '1px solid #F3F4F6' }}>
          <div className="px-4 py-3.5 border-b border-[#F3F4F6] flex items-center gap-2">
            <Activity size={15} color="#4F46E5" strokeWidth={2} />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Account Statistics</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-[#F3F4F6]">
            {[
              { label: 'Reports Created', value: stats.reportsCreated, color: '#4F46E5' },
              { label: 'Evidence Uploaded', value: stats.evidenceUploaded, color: '#EC4899' },
              { label: 'AI Analyses', value: stats.aiAnalyses, color: '#16A34A' },
              { label: 'Days Active', value: daysActiveSince(profile?.createdAt), color: '#D97706' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-4">
                <p style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>{statsLoading ? '—' : stat.value}</p>
                <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 2 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member info */}
        <div className="bg-white rounded-2xl px-4 py-3.5 mb-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} color="#6B7280" strokeWidth={1.8} />
              <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>Member since</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{formatMemberSince(profile?.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Shield size={14} color="#16A34A" strokeWidth={1.8} />
              <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>Security status</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#16A34A', fontFamily: 'Inter, -apple-system, sans-serif' }}>Secured</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Globe size={14} color="#6B7280" strokeWidth={1.8} />
              <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>Language</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Urdu · اردو</span>
          </div>
        </div>

        {/* Menu sections */}
        {[
          {
            title: 'Account',
            items: [
              { icon: User, label: 'Personal Information', sublabel: 'Name, CNIC, date of birth', onPress: () => setEditing(true) },
              { icon: Lock, label: 'Security & Privacy', sublabel: 'Password, PIN, biometrics', color: '#4F46E5', onPress: () => navigate('settings') },
              { icon: Bell, label: 'Notifications', sublabel: 'Alerts and reminders', onPress: () => navigate('notifications') },
              { icon: Globe, label: 'Language', sublabel: 'Urdu · Change language', onPress: () => navigate('language') },
            ],
          },
          {
            title: 'Safety',
            items: [
              { icon: Shield, label: 'Safe Exit', sublabel: 'Quick exit configuration', color: '#16A34A', onPress: () => navigate('safe-exit') },
            ],
          },
          {
            title: 'Support',
            items: [
              { icon: HelpCircle, label: 'Contact Support', sublabel: 'Get help with the app', onPress: () => navigate('contact-support') },
              { icon: Info, label: 'About Nawaye Nisa', sublabel: 'Version 1.0.0', onPress: () => navigate('about') },
            ],
          },
        ].map((section) => (
          <div key={section.title} className="mb-4">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{section.title}</p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.onPress}
                  className="flex items-center gap-3 px-4 py-3.5 w-full text-left transition-all active:bg-[#F8F9FF]"
                  style={{ borderBottom: i < section.items.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} color={('color' in item && item.color) || '#374151'} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.sublabel}</p>
                  </div>
                  <ChevronRight size={15} color="#D1D5DB" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98]"
          style={{ border: '1px solid #FECACA' }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <LogOut size={16} color="#DC2626" strokeWidth={1.8} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif', flex: 1, textAlign: 'left' }}>Sign Out</p>
        </button>

        <p className="text-center mt-4 mb-2" style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>
          Nawaye Nisa v1.0.0 · Supported by UN Women Pakistan
        </p>
        <div className="h-4" />
      </div>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </div>
  )
}
