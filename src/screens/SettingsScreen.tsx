import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className="relative rounded-full transition-all flex-shrink-0"
    style={{ width: 44, height: 26, background: enabled ? '#4F46E5' : '#D1D5DB' }}
  >
    <div
      className="absolute top-1 rounded-full bg-white shadow-sm transition-all"
      style={{ width: 18, height: 18, left: enabled ? 22 : 4 }}
    />
  </button>
)

export default function SettingsScreen({ navigate, goBack }: NavProps) {
  const [settings, setSettings] = useState({
    biometric: true,
    notifications: true,
    faceId: true,
    panicShake: true,
    location: false,
    autoLock: true,
    safeExit: true,
    encryption: true,
    darkMode: false,
    urdu: true,
    screenshotProtect: true,
  })

  const toggle = (key: keyof typeof settings) => setSettings({ ...settings, [key]: !settings[key] })

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <p className="text-[#9CA3AF] px-1 mb-2" style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</p>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
        {children}
      </div>
    </div>
  )

  const Row = ({ label, sublabel, toggleKey, onPress }: { label: string; sublabel?: string; toggleKey?: keyof typeof settings; onPress?: () => void }) => (
    <div
      className="flex items-center justify-between px-4 py-3.5 border-b border-[#F3F4F6] last:border-0"
      onClick={onPress}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{label}</p>
        {sublabel && <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{sublabel}</p>}
      </div>
      {toggleKey ? (
        <Toggle enabled={settings[toggleKey]} onChange={() => toggle(toggleKey)} />
      ) : (
        <ChevronRight size={16} color="#D1D5DB" />
      )}
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Settings</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <Section title="Security">
          <Row label="Face ID / Biometric Login" sublabel="Use biometrics to unlock" toggleKey="biometric" />
          <Row label="Emergency PIN" sublabel="4-digit quick access PIN" onPress={() => {}} />
          <Row label="Auto-Lock" sublabel="Lock after 5 minutes" toggleKey="autoLock" />
          <Row label="Screenshot Protection" sublabel="Block screenshots in app" toggleKey="screenshotProtect" />
        </Section>

        <Section title="Privacy">
          <Row label="End-to-End Encryption" sublabel="Always active" toggleKey="encryption" />
          <Row label="Location Services" sublabel="Required for nearby help" toggleKey="location" />
          <Row label="Data Export" onPress={() => {}} />
          <Row label="Delete All Data" onPress={() => {}} />
        </Section>

        <Section title="Emergency">
          <Row label="Panic Mode Shake" sublabel="Shake phone to activate SOS" toggleKey="panicShake" />
          <Row label="Safe Exit" sublabel="Quick exit to safe app" toggleKey="safeExit" />
          <Row label="SOS Alert Settings" onPress={() => navigate('trusted-contacts')} />
        </Section>

        <Section title="Notifications">
          <Row label="Push Notifications" toggleKey="notifications" />
          <Row label="Deadline Reminders" sublabel="Filing deadlines" toggleKey="notifications" />
        </Section>

        <Section title="Display">
          <Row label="Language" sublabel="Urdu" onPress={() => navigate('language')} />
          <Row label="Urdu Interface" sublabel="Right-to-left layout" toggleKey="urdu" />
          <Row label="Dark Mode" toggleKey="darkMode" />
        </Section>

        <div className="h-4" />
      </div>
    </div>
  )
}
