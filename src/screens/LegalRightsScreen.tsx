import { useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Scale, Search, Bookmark } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const LAWS = [
  {
    short: 'PAWWA 2010',
    title: 'Protection Against Harassment of Women at Workplace Act, 2010',
    category: 'Workplace',
    year: '2010',
    color: '#4F46E5',
    bg: '#EEF2FF',
    sections: [
      'Defines harassment and hostile work environment at workplace',
      'Mandates all organizations to form Inquiry Committees',
      'Penalties: up to 3 years imprisonment and Rs. 500,000 fine',
      'Employer liable if they fail to act on a complaint',
    ],
  },
  {
    short: 'PECA 2016',
    title: 'Prevention of Electronic Crimes Act, 2016',
    category: 'Cyber',
    year: '2016',
    color: '#7C3AED',
    bg: '#F5F3FF',
    sections: [
      'Section 24: Cyberstalking — 3 years + Rs. 1 million fine',
      'Section 25: Cyber harassment — 3 years + Rs. 1 million fine',
      'Section 26: Sharing intimate images without consent — 3–7 years',
      'FIA Cybercrime Wing handles investigations',
    ],
  },
  {
    short: 'PWAVA 2016',
    title: 'Protection of Women Against Violence Act, 2016',
    category: 'Domestic',
    year: '2016',
    color: '#EC4899',
    bg: '#FDF2F8',
    sections: [
      'Applies in Punjab (similar laws in other provinces)',
      'Provides Protection Orders, Residence Orders, Monetary Orders',
      'Women Protection Officers available in each district',
      'GPS tracking of perpetrators possible under court order',
    ],
  },
  {
    short: 'PPC — Key Sections',
    title: 'Pakistan Penal Code — Relevant Provisions',
    category: 'Criminal',
    year: '1860',
    color: '#D97706',
    bg: '#FEF3C7',
    sections: [
      'Section 354: Assault with intent to outrage modesty — 7 years',
      'Section 354-A: Assault with intent (aggravated) — 3 years',
      'Section 509: Words or gestures insulting modesty — 3 years',
      'Section 376: Rape — 10–25 years or death penalty',
    ],
  },
  {
    short: 'ARITA 2021',
    title: 'Anti-Rape (Investigation & Trial) Act, 2021',
    category: 'Criminal',
    year: '2021',
    color: '#DC2626',
    bg: '#FEF2F2',
    sections: [
      'Special courts dedicated to rape cases established',
      'Trial must be completed within 4 months',
      'Anti-rape crisis cells in all major hospitals — forensic evidence',
      'In-camera proceedings to protect victim identity',
    ],
  },
  {
    short: 'Child Protection',
    title: 'Zainab Alert Response and Recovery Act, 2020',
    category: 'Child',
    year: '2020',
    color: '#16A34A',
    bg: '#F0FDF4',
    sections: [
      'Immediate alert system for missing children',
      'ZARRA — dedicated child protection authority',
      'Penalty for child sexual abuse: 7 years to life imprisonment',
      'DNA forensic database for perpetrators',
    ],
  },
]

const CATEGORIES = ['All', 'Workplace', 'Cyber', 'Domestic', 'Criminal', 'Child']

export default function LegalRightsScreen({ goBack }: NavProps) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const filtered = LAWS.filter((law) => {
    const matchCat = category === 'All' || law.category === category
    const matchSearch = law.title.toLowerCase().includes(search.toLowerCase()) || law.short.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const toggleBookmark = (short: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(bookmarked)
    next.has(short) ? next.delete(short) : next.add(short)
    setBookmarked(next)
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#F3F4F6]">
        <StatusBar />
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Legal Rights</h1>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>Pakistan law · Verified sources · 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 bg-[#FAFAFA] mb-3" style={{ height: 42 }}>
            <Search size={15} color="#9CA3AF" strokeWidth={1.8} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laws, sections, rights..."
              className="flex-1 bg-transparent outline-none text-[#111827]"
              style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl"
                style={{ background: category === cat ? '#4F46E5' : '#F3F4F6', fontSize: 12, fontWeight: category === cat ? 700 : 500, color: category === cat ? 'white' : '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-[#EEF2FF] rounded-2xl px-4 py-3 mb-4 flex gap-2.5 items-start">
          <Scale size={15} color="#4F46E5" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
          <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
            Information is for awareness only. Consult a licensed attorney for advice specific to your case. Laws apply based on jurisdiction.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {filtered.map((law, i) => {
            const isExpanded = expanded === i
            const isBookmarked = bookmarked.has(law.short)
            return (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all"
                style={{ border: `1px solid ${isExpanded ? law.color + '30' : '#F3F4F6'}` }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: law.bg }}>
                    <BookOpen size={18} color={law.color} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="px-2 py-0.5 rounded-md" style={{ background: law.bg }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: law.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{law.short}</span>
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{law.year}</span>
                      <div className="px-1.5 py-0.5 rounded-md bg-[#F3F4F6]">
                        <span style={{ fontSize: 9, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500 }}>{law.category}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.4 }}>{law.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => toggleBookmark(law.short, e)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: isBookmarked ? '#EEF2FF' : '#F3F4F6' }}
                    >
                      <Bookmark size={13} color={isBookmarked ? '#4F46E5' : '#9CA3AF'} strokeWidth={2} fill={isBookmarked ? '#4F46E5' : 'none'} />
                    </button>
                    <ChevronRight
                      size={15}
                      color="#9CA3AF"
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#F9FAFB]">
                    <div className="flex flex-col gap-2.5 pt-3">
                      {law.sections.map((section, j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: law.color }} />
                          <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>{section}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* FIR guide */}
        <div className="mt-4 bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <div className="px-4 py-3.5 border-b border-[#F3F4F6]">
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>How to File an FIR in Pakistan</p>
          </div>
          {[
            { n: '01', text: 'Visit the nearest police station with your complaint' },
            { n: '02', text: 'Request to file an FIR with the SHO (Station House Officer)' },
            { n: '03', text: 'Provide a written or verbal statement of the incident' },
            { n: '04', text: 'Police are legally required to register your FIR — it is their duty' },
            { n: '05', text: 'Obtain a free copy of the registered FIR immediately' },
            { n: '06', text: 'If refused, approach the District Police Officer or Magistrate (Section 22-A CrPC)' },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-3 px-4 py-3 border-b border-[#F9FAFB] last:border-0">
              <div className="w-6 h-6 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span style={{ fontSize: 10, fontWeight: 800, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>{step.n}</span>
              </div>
              <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.55 }}>{step.text}</p>
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
