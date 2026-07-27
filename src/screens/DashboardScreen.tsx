import { Bell, ChevronRight, Plus, Shield, Brain, Phone, BookOpen, Users, MapPin, AlertTriangle, FileText, TrendingUp, Lock, Activity } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import { useAuth } from '../contexts/AuthContext'

function initialsFor(name: string | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?'
}

function timeAwareGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning,'
  if (hour < 17) return 'Good afternoon,'
  return 'Good evening,'
}

export default function DashboardScreen({ navigate }: NavProps) {
  const { profile } = useAuth()
  const quickActions = [
    { icon: Plus, label: 'New Report', color: '#4F46E5', bg: '#EEF2FF', nav: 'report-incident' as const },
    { icon: Shield, label: 'Evidence', color: '#EC4899', bg: '#FDF2F8', nav: 'evidence-vault' as const },
    { icon: Brain, label: 'AI Analysis', color: '#16A34A', bg: '#F0FDF4', nav: 'ai-assistant' as const },
    { icon: Phone, label: 'Emergency', color: '#DC2626', bg: '#FEF2F2', nav: 'emergency' as const },
  ]

  const recentReports = [
    { title: 'Workplace Harassment', date: 'Jul 18, 2025', status: 'In Progress', statusColor: '#D97706', statusBg: '#FEF3C7', id: 'NWN-2025-0318' },
    { title: 'Cyberstalking', date: 'Jul 10, 2025', status: 'Draft', statusColor: '#6B7280', statusBg: '#F3F4F6', id: 'NWN-2025-0289' },
    { title: 'Domestic Violence', date: 'Jun 28, 2025', status: 'Submitted', statusColor: '#16A34A', statusBg: '#F0FDF4', id: 'NWN-2025-0201' },
  ]

  const aiInsights = [
    { text: 'Case NWN-0318 strength increased to 78% after new evidence', type: 'positive' },
    { text: 'Filing deadline in 72 days — recommended to act soon', type: 'warning' },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#F3F4F6]">
        <StatusBar />
        <div className="flex items-center justify-between px-5 pb-4 pt-1">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>{initialsFor(profile?.fullName)}</span>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{timeAwareGreeting()}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.01em' }}>{profile?.fullName || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('notifications')}
              className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center relative"
            >
              <Bell size={17} color="#374151" strokeWidth={1.8} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EC4899] border border-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Security status banner */}
        <div className="mx-4 mt-4">
          <div
            className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #312E81, #4F46E5)' }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Lock size={16} color="white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>Account secured · AES-256 encrypted</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, -apple-system, sans-serif' }}>Last login: Today, 9:41 AM · Lahore</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-4 mt-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Reports', value: '3', sub: '+1 this month', color: '#4F46E5', bg: '#EEF2FF' },
              { label: 'Evidence Items', value: '12', sub: '4 new this week', color: '#EC4899', bg: '#FDF2F8' },
              { label: 'Days Active', value: '24', sub: 'Since Jun 24', color: '#16A34A', bg: '#F0FDF4' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl px-3.5 py-3.5 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: stat.color, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 4, lineHeight: 1.2 }}>{stat.label}</p>
                <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 2 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-4">
          <p style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Quick Actions</p>
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.nav)}
                className="flex flex-col items-center gap-2.5 rounded-2xl py-4 transition-all active:scale-95"
                style={{ background: action.bg }}
              >
                <action.icon size={20} color={action.color} strokeWidth={1.8} />
                <p style={{ fontSize: 10.5, fontWeight: 700, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', textAlign: 'center', lineHeight: 1.2 }}>{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency SOS */}
        <div className="px-4 mt-3">
          <button
            onClick={() => navigate('emergency')}
            className="w-full rounded-2xl flex items-center gap-4 px-4 py-4 transition-all active:scale-[0.98]"
            style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626] flex items-center justify-center flex-shrink-0">
              <Phone size={22} color="white" strokeWidth={2} />
            </div>
            <div className="flex-1 text-left">
              <p style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>Emergency Center</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 1 }}>Police · Women Helpline · Safe Exit · SOS</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center">
              <ChevronRight size={16} color="white" strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* AI Insights */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <p style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Insights</p>
            <button onClick={() => navigate('ai-assistant')} style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>Open AI →</button>
          </div>
          <div className="flex flex-col gap-2">
            {aiInsights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-white shadow-sm"
                style={{ border: '1px solid #F3F4F6' }}
              >
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: insight.type === 'positive' ? '#EEF2FF' : '#FEF3C7' }}
                >
                  <Brain size={13} color={insight.type === 'positive' ? '#4F46E5' : '#D97706'} strokeWidth={2} />
                </div>
                <p style={{ fontSize: 12.5, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.55 }}>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <p style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Recent Reports</p>
            <button onClick={() => navigate('report-history')} style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>View all →</button>
          </div>
          <div className="flex flex-col gap-2">
            {recentReports.map((report) => (
              <button
                key={report.id}
                onClick={() => navigate('report-history')}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 w-full text-left transition-all active:scale-[0.98] shadow-sm"
                style={{ border: '1px solid #F3F4F6' }}
              >
                <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                  <FileText size={16} color="#4F46E5" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.title}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 1 }}>{report.id} · {report.date}</p>
                </div>
                <div className="px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: report.statusBg }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: report.statusColor, fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly activity */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Monthly Activity</p>
              <div className="px-2 py-0.5 rounded-full bg-[#EEF2FF]">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>JULY 2025</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-16">
              {[3, 5, 2, 8, 4, 6, 3, 7, 9, 5, 6, 4, 8, 3, 5, 7, 6, 4, 5, 8, 6, 3, 4, 6, 7, 5, 8, 9, 6, 7, 5].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${(h / 9) * 100}%`,
                    background: i >= 28 ? '#4F46E5' : i >= 25 ? '#818CF8' : '#E5E7EB',
                    minWidth: 3,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>Jul 1</span>
              <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>Jul 31</span>
            </div>
          </div>
        </div>

        {/* Bottom 2×2 grid */}
        <div className="px-4 mt-3 grid grid-cols-2 gap-3">
          {[
            { icon: BookOpen, color: '#4F46E5', bg: '#EEF2FF', label: 'Legal Rights', sub: 'Pakistan law guides', nav: 'legal-rights' as const },
            { icon: MapPin, color: '#EC4899', bg: '#FDF2F8', label: 'Nearby Help', sub: 'Shelters & centers', nav: 'nearby-help' as const },
            { icon: Users, color: '#16A34A', bg: '#F0FDF4', label: 'Trusted Contacts', sub: '3 contacts saved', nav: 'trusted-contacts' as const },
            { icon: TrendingUp, color: '#D97706', bg: '#FEF3C7', label: 'Awareness Hub', sub: 'Safety resources', nav: 'awareness' as const },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.nav)}
              className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-2.5 text-left transition-all active:scale-95 shadow-sm"
              style={{ border: '1px solid #F3F4F6' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                <item.icon size={18} color={item.color} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.label}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 1 }}>{item.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Safety tip */}
        <div className="mx-4 mt-3 mb-5">
          <div className="bg-white rounded-2xl px-4 py-4 flex gap-3 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={15} color="#D97706" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Safety Tip · Jul 22</p>
              <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6, marginTop: 3 }}>
                Save evidence immediately after an incident. Screenshots, messages and photos with timestamps are critical for legal proceedings. Store them in your encrypted Evidence Vault.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
