import { Home, FileText, Shield, Phone, User } from 'lucide-react'
import type { Screen } from '../types'

interface BottomNavProps {
  active: Screen
  navigate: (screen: Screen) => void
}

const tabs = [
  { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
  { id: 'report-history' as Screen, icon: FileText, label: 'Reports' },
  { id: 'evidence-vault' as Screen, icon: Shield, label: 'Evidence' },
  { id: 'emergency' as Screen, icon: Phone, label: 'Emergency' },
  { id: 'profile' as Screen, icon: User, label: 'Profile' },
]

export default function BottomNav({ active, navigate }: BottomNavProps) {
  return (
    <div
      className="flex items-center justify-around border-t border-[#E5E7EB] bg-white"
      style={{ paddingBottom: 20, paddingTop: 10, paddingLeft: 8, paddingRight: 8 }}
    >
      {tabs.map((tab) => {
        const isActive =
          active === tab.id ||
          (tab.id === 'dashboard' && active === 'dashboard') ||
          (tab.id === 'report-history' && (active === 'report-incident' || active === 'incident-form' || active === 'timeline' || active === 'complaint-preview' || active === 'report-history')) ||
          (tab.id === 'evidence-vault' && (active === 'evidence-vault' || active === 'upload-evidence')) ||
          (tab.id === 'emergency' && (active === 'emergency' || active === 'trusted-contacts' || active === 'nearby-help')) ||
          (tab.id === 'profile' && (active === 'profile' || active === 'settings' || active === 'about' || active === 'contact-support'))
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
            style={{ minWidth: 56 }}
          >
            <tab.icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              color={isActive ? '#4F46E5' : '#9CA3AF'}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#4F46E5' : '#9CA3AF',
                letterSpacing: '0.02em',
                fontFamily: 'Inter, -apple-system, sans-serif',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
