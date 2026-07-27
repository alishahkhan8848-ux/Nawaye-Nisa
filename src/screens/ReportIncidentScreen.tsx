import { ChevronRight, ChevronLeft } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const categories = [
  { label: 'Sexual Harassment', icon: '⚠️', color: '#DC2626', bg: '#FEF2F2', severity: 'High' },
  { label: 'Domestic Violence', icon: '🏠', color: '#DC2626', bg: '#FEF2F2', severity: 'High' },
  { label: 'Cyber Harassment', icon: '💻', color: '#D97706', bg: '#FEF3C7', severity: 'Medium' },
  { label: 'Cyber Blackmail', icon: '🔒', color: '#D97706', bg: '#FEF3C7', severity: 'Medium' },
  { label: 'Physical Assault', icon: '⚡', color: '#DC2626', bg: '#FEF2F2', severity: 'High' },
  { label: 'Stalking', icon: '👁', color: '#7C3AED', bg: '#F5F3FF', severity: 'Medium' },
  { label: 'Forced Marriage', icon: '💍', color: '#DC2626', bg: '#FEF2F2', severity: 'High' },
  { label: 'Workplace Harassment', icon: '🏢', color: '#D97706', bg: '#FEF3C7', severity: 'Medium' },
  { label: 'Child Abuse', icon: '🛡', color: '#DC2626', bg: '#FEF2F2', severity: 'High' },
  { label: 'Human Trafficking', icon: '🔗', color: '#DC2626', bg: '#FEF2F2', severity: 'High' },
  { label: 'Other', icon: '📋', color: '#6B7280', bg: '#F9FAFB', severity: 'Varies' },
]

export default function ReportIncidentScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="px-5 pt-3 pb-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Report Incident</h1>
            <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Select incident category</p>
          </div>
        </div>

        <div className="bg-[#EEF2FF] rounded-2xl px-4 py-3">
          <p className="text-[#4F46E5]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>Confidential</span> — This report is encrypted and can only be accessed by you. It will never be shared without your explicit consent.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[#6B7280] mb-4" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}>
          Choose the category that best describes your situation
        </p>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate('incident-form')}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-[#F3F4F6] bg-white transition-all active:scale-[0.98] text-left shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.bg }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-[#111827]" style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{cat.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                  <p style={{ fontSize: 11, color: cat.color, fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500 }}>Severity: {cat.severity}</p>
                </div>
              </div>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}
