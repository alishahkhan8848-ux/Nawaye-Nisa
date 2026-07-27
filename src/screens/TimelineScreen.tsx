import { ChevronLeft, FileText, Image, Shield, Brain, Plus } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const events = [
  {
    date: 'Jul 18, 2025',
    time: '2:30 PM',
    type: 'incident',
    title: 'Incident Reported',
    desc: 'Workplace harassment report filed with details and initial evidence',
    icon: FileText,
    color: '#4F46E5',
    bg: '#EEF2FF',
    tags: ['Workplace', 'Digital'],
  },
  {
    date: 'Jul 18, 2025',
    time: '2:35 PM',
    type: 'ai',
    title: 'AI Analysis Completed',
    desc: 'Case strength assessed at 78%. 3 applicable laws identified.',
    icon: Brain,
    color: '#EC4899',
    bg: '#FDF2F8',
    tags: ['PAWWA 2010', 'PECA 2016'],
  },
  {
    date: 'Jul 17, 2025',
    time: '11:45 AM',
    type: 'evidence',
    title: 'Evidence Added',
    desc: 'Screenshot_threat_1.jpg — Threatening message from supervisor',
    icon: Image,
    color: '#16A34A',
    bg: '#F0FDF4',
    tags: ['Photo'],
  },
  {
    date: 'Jul 16, 2025',
    time: '4:00 PM',
    type: 'evidence',
    title: 'Security Footage Obtained',
    desc: 'CCTV footage from office corridor submitted to vault',
    icon: Shield,
    color: '#7C3AED',
    bg: '#F5F3FF',
    tags: ['Video', 'CCTV'],
  },
  {
    date: 'Jul 15, 2025',
    time: '9:00 AM',
    type: 'incident',
    title: 'First Incident Documented',
    desc: 'Initial verbal harassment in manager\'s office. Voice recording captured.',
    icon: FileText,
    color: '#4F46E5',
    bg: '#EEF2FF',
    tags: ['Verbal', 'Audio'],
  },
  {
    date: 'Jun 28, 2025',
    time: '3:15 PM',
    type: 'incident',
    title: 'Prior Incident Noted',
    desc: 'Earlier harassment at workplace lunch meeting documented',
    icon: FileText,
    color: '#D97706',
    bg: '#FEF3C7',
    tags: ['Prior'],
  },
]

export default function TimelineScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
                <ChevronLeft size={20} color="#111827" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Case Timeline</h1>
                <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Workplace Harassment · 6 events</p>
              </div>
            </div>
            <button
              className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center"
              onClick={() => navigate('incident-form')}
            >
              <Plus size={18} color="white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-4 bottom-4 w-px"
            style={{ background: 'linear-gradient(to bottom, #4F46E5, #E5E7EB)' }}
          />

          <div className="flex flex-col gap-5">
            {events.map((event, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center z-10"
                    style={{ background: event.bg, border: `2px solid ${event.color}20` }}
                  >
                    <event.icon size={20} color={event.color} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl px-4 py-3.5 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>{event.title}</p>
                      <p className="text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{event.date} · {event.time}</p>
                    </div>
                  </div>
                  <p className="text-[#6B7280] mt-1.5" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{event.desc}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {event.tags.map((tag) => (
                      <div key={tag} className="px-2 py-0.5 rounded-lg" style={{ background: event.bg }}>
                        <span style={{ fontSize: 10, color: event.color, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-4" />
      </div>

      <div className="px-5 py-4 border-t border-[#F3F4F6] bg-white">
        <button
          onClick={() => navigate('complaint-preview')}
          className="w-full rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{
            height: 52,
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            fontSize: 15,
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontWeight: 600,
          }}
        >
          <FileText size={18} strokeWidth={2} />
          Generate Complaint
        </button>
      </div>
    </div>
  )
}
