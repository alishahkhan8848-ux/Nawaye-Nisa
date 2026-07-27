import { ChevronLeft, ChevronRight, TrendingUp, BookOpen, Video } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const articles = [
  { category: 'Digital Safety', title: 'How to Stay Safe Online: Protecting Your Digital Identity', time: '5 min read', color: '#4F46E5', bg: '#EEF2FF' },
  { category: 'Legal Rights', title: 'Understanding the Protection Against Harassment Act 2010', time: '8 min read', color: '#16A34A', bg: '#F0FDF4' },
  { category: 'Mental Health', title: 'Recognizing Trauma: Resources for Survivors', time: '6 min read', color: '#EC4899', bg: '#FDF2F8' },
  { category: 'Documentation', title: 'What Evidence to Collect and How to Preserve It', time: '4 min read', color: '#7C3AED', bg: '#F5F3FF' },
  { category: 'Safety Planning', title: 'Creating a Personal Safety Plan in 5 Steps', time: '7 min read', color: '#D97706', bg: '#FEF3C7' },
]

const videos = [
  { title: 'Your Rights Under PECA 2016', duration: '12:30', color: '#4F46E5' },
  { title: 'How to File a Complaint: Step by Step', duration: '8:45', color: '#EC4899' },
]

const stats = [
  { label: 'Women experience GBV', value: '32%', source: 'Pakistan DHS 2018' },
  { label: 'Cases reported to police', value: '8%', source: 'HRW Report 2023' },
  { label: 'Conviction rate', value: '3%', source: 'AGHS Legal Aid' },
]

export default function AwarenessScreen({ goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Awareness Hub</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Stats */}
        <div className="mb-5">
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Pakistan GBV Statistics</p>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl px-3 py-3.5 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                <p className="text-[#DC2626]" style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p className="text-[#111827]" style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.3, marginTop: 2 }}>{stat.label}</p>
                <p className="text-[#9CA3AF]" style={{ fontSize: 9, fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 2 }}>{stat.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured video */}
        <div className="mb-5">
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Video Resources</p>
          <div className="flex flex-col gap-2.5">
            {videos.map((video) => (
              <div key={video.title} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                <div
                  className="h-24 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${video.color}20, ${video.color}10)` }}
                >
                  <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                    <Video size={24} color={video.color} strokeWidth={1.8} />
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{video.title}</p>
                    <p className="text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{video.duration}</p>
                  </div>
                  <ChevronRight size={16} color="#9CA3AF" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div>
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Articles & Guides</p>
          <div className="flex flex-col gap-2.5">
            {articles.map((article) => (
              <button key={article.title} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 w-full text-left shadow-sm active:scale-[0.98] transition-all" style={{ border: '1px solid #F3F4F6' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: article.bg }}>
                  <BookOpen size={18} color={article.color} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="px-2 py-0.5 rounded-md inline-block mb-1" style={{ background: article.bg }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: article.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{article.category}</span>
                  </div>
                  <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.3 }}>{article.title}</p>
                  <p className="text-[#9CA3AF] mt-0.5" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{article.time}</p>
                </div>
                <ChevronRight size={14} color="#9CA3AF" />
              </button>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
