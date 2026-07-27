import { ChevronLeft, Brain, FileText, ChevronRight, Download, Share2, CheckCircle, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

export default function AIResultScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>AI Analysis Report</h1>
              <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Generated · Jul 18, 2025 at 2:35 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* Score card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Case Strength Assessment</p>
              <p className="text-white" style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>Strong Case</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
              <Brain size={30} color="white" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 rounded-full bg-white/20">
              <div className="h-full bg-white rounded-full" style={{ width: '78%' }} />
            </div>
            <span className="text-white" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>78%</span>
          </div>
          <p className="text-white/70" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>
            Based on 12 evidence items and 3 documented incidents
          </p>
        </div>

        {/* Key Findings */}
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Key Findings</p>
          <div className="flex flex-col gap-3">
            {[
              { icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4', text: 'Pattern of repeated harassment documented across 3 incidents' },
              { icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4', text: 'Digital evidence (screenshots) with preserved metadata' },
              { icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4', text: 'Witnessed by 2 colleagues — corroborating testimony available' },
              { icon: AlertCircle, color: '#D97706', bg: '#FEF3C7', text: 'Medical documentation recommended to strengthen case' },
              { icon: AlertCircle, color: '#D97706', bg: '#FEF3C7', text: 'Filing within 90 days of last incident is recommended' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                  <item.icon size={14} color={item.color} strokeWidth={2} />
                </div>
                <p className="text-[#374151]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Applicable Laws */}
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Applicable Laws</p>
          <div className="flex flex-col gap-2.5">
            {[
              { law: 'Protection Against Harassment of Women at Workplace Act, 2010', section: 'Section 3, 4, 7', severity: 'Primary' },
              { law: 'Prevention of Electronic Crimes Act (PECA), 2016', section: 'Section 24, 25', severity: 'Applicable' },
              { law: 'Pakistan Penal Code', section: 'Section 509', severity: 'Applicable' },
            ].map((law, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
                <div className="w-1 h-full flex-shrink-0">
                  <div className="w-1 h-full rounded-full bg-[#4F46E5] min-h-[40px]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#111827]" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.4 }}>{law.law}</p>
                  <p className="text-[#6B7280] mt-0.5" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{law.section}</p>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-[#EEF2FF]">
                  <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{law.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>AI Incident Summary</p>
          <p className="text-[#374151]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.7 }}>
            The complainant, Ms. Fatima Khan, has documented a series of workplace harassment incidents occurring between June 15 and July 18, 2025, at XYZ Corporation, Lahore. The incidents involve verbal threats, intimidating messages, and inappropriate conduct by a direct supervisor. Digital evidence including 8 screenshots with verified timestamps has been preserved. The pattern of behavior constitutes actionable harassment under Pakistani law.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
            <Brain size={14} color="#6B7280" strokeWidth={1.8} />
            <p className="text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>Generated by Nawaye Nisa AI · Not a substitute for legal advice</p>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Recommended Next Steps</p>
          {[
            { step: '01', text: 'File complaint with company HR under PAWWA 2010', urgent: true },
            { step: '02', text: 'Register complaint at FIA Cybercrime Wing', urgent: true },
            { step: '03', text: 'Obtain medical evaluation from approved doctor', urgent: false },
            { step: '04', text: 'Contact Women Protection Officer in your district', urgent: false },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.urgent ? '#EEF2FF' : '#F9FAFB' }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: item.urgent ? '#4F46E5' : '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.step}</span>
              </div>
              <p className="text-[#374151] flex-1" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{item.text}</p>
              {item.urgent && (
                <div className="px-2 py-0.5 rounded-full bg-[#FEF3C7] flex-shrink-0">
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#D97706', fontFamily: 'Inter, -apple-system, sans-serif' }}>URGENT</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-2" />
      </div>

      {/* Bottom actions */}
      <div className="px-5 py-4 border-t border-[#F3F4F6] bg-white flex gap-3">
        <button
          className="flex items-center justify-center gap-2 px-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
          style={{ height: 52, fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
          <Download size={16} strokeWidth={1.8} />
          Export
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
          style={{ height: 52, fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
          <Share2 size={16} strokeWidth={1.8} />
          Share
        </button>
        <button
          onClick={() => navigate('complaint-preview')}
          className="flex-1 rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{
            height: 52,
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            fontSize: 14,
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontWeight: 600,
          }}
        >
          <FileText size={16} strokeWidth={2} />
          Generate Complaint
        </button>
      </div>
    </div>
  )
}
