import { useState } from 'react'
import { ChevronLeft, Send, Brain, Sparkles, FileText, ChevronRight, Activity, Scale, Clock } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const SUGGESTED = [
  'Summarize my case',
  'What are my legal options?',
  'Draft an FIR complaint',
  'What evidence am I missing?',
  'Explain PECA Section 24',
  'Recommended next step',
]

const MESSAGES = [
  {
    role: 'assistant',
    text: "I've reviewed your Workplace Harassment case (NWN-2025-0318). Your case has a **strong foundation** with 12 evidence items across 3 documented incidents.\n\nHow can I assist you today?",
    time: '2:30 PM',
    isTyping: false,
  },
  {
    role: 'user',
    text: 'What are my strongest legal options given the evidence I have?',
    time: '2:31 PM',
    isTyping: false,
  },
  {
    role: 'assistant',
    text: "Based on your documented evidence, you have **3 strong legal pathways**:\n\n**1. Internal HR Complaint (Fastest)**\nUnder PAWWA 2010, your employer is legally required to have an inquiry committee. File internally first — this creates an official record.\n\n**2. FIA Cybercrime Wing Complaint**\nYour 8 screenshots of threatening messages fall under PECA 2016, Section 24 (cyberstalking). The FIA can issue a formal notice within 72 hours.\n\n**3. Women Protection Officer**\nFile with the district WPO for a Protection Order — this legally prohibits contact from the accused.\n\nI recommend pursuing all three simultaneously.",
    time: '2:31 PM',
    isTyping: false,
  },
]

const CHECKLIST = [
  { label: 'Screenshots with timestamps', done: true },
  { label: 'Date & time documented', done: true },
  { label: 'Witness information', done: true },
  { label: 'CCTV / video evidence', done: true },
  { label: 'Voice recording captured', done: true },
  { label: 'Medical documentation', done: false },
  { label: 'Prior incident records', done: false },
]

export default function AIAssistantScreen({ navigate, goBack }: NavProps) {
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat')

  const completedCount = CHECKLIST.filter(i => i.done).length

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#F3F4F6]">
        <StatusBar />
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center flex-shrink-0">
                  <Brain size={13} color="white" strokeWidth={2} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>AI Case Assistant</p>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F0FDF4]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', fontFamily: 'Inter, -apple-system, sans-serif' }}>Online</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>Reviewing: NWN-2025-0318 · Workplace Harassment</p>
            </div>
            <button
              onClick={() => navigate('ai-result')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              <Sparkles size={12} />
              Analyze
            </button>
          </div>

          {/* Case summary strip */}
          <div className="flex gap-2">
            {[
              { label: 'Strength', value: '78%', color: '#4F46E5', bg: '#EEF2FF' },
              { label: 'Evidence', value: '12', color: '#16A34A', bg: '#F0FDF4' },
              { label: 'Days left', value: '72', color: '#D97706', bg: '#FEF3C7' },
            ].map((item) => (
              <div key={item.label} className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl" style={{ background: item.bg }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: item.color, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: 9, color: item.color, fontFamily: 'Inter, -apple-system, sans-serif', opacity: 0.8 }}>{item.label}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('ai-result')}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl"
              style={{ background: '#F3F4F6' }}
            >
              <FileText size={13} color="#6B7280" strokeWidth={1.8} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>Report</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-[#F3F4F6]">
          {[
            { id: 'chat', label: 'Chat' },
            { id: 'insights', label: 'Insights & Checklist' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 py-2.5 relative"
              style={{ fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? '#4F46E5' : '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-[#4F46E5]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
            {MESSAGES.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center flex-shrink-0 mt-auto mb-4">
                    <Brain size={13} color="white" strokeWidth={2} />
                  </div>
                )}
                <div style={{ maxWidth: '80%' }}>
                  <div
                    className="px-4 py-3"
                    style={{
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : 'white',
                      borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                      border: msg.role === 'assistant' ? '1px solid #F0F0F0' : 'none',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: msg.role === 'user' ? 'white' : '#111827',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        whiteSpace: 'pre-line',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: 4, paddingRight: 4 }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Generate complaint CTA */}
            <button
              onClick={() => navigate('complaint-preview')}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full text-left transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1.5px solid #C7D2FE' }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                <FileText size={18} color="white" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>Generate Formal Complaint</p>
                <p style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>AI-drafted legal document · Ready in seconds</p>
              </div>
              <ChevronRight size={16} color="#4F46E5" />
            </button>
          </div>

          {/* Suggested prompts */}
          <div className="px-4 py-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="flex-shrink-0 px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#374151] transition-all active:scale-95"
                  style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500, whiteSpace: 'nowrap' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 pb-5 pt-2 bg-white border-t border-[#F3F4F6]">
            <div
              className="flex items-center gap-3 rounded-2xl border px-4 bg-[#FAFAFA]"
              style={{ borderColor: input ? '#4F46E5' : '#E5E7EB', borderWidth: input ? 1.5 : 1, minHeight: 50 }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a legal question about your case..."
                className="flex-1 bg-transparent outline-none text-[#111827] py-3"
                style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}
              />
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: input ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : '#E5E7EB', flexShrink: 0 }}
              >
                <Send size={15} color={input ? 'white' : '#9CA3AF'} strokeWidth={2} />
              </button>
            </div>
            <p className="text-center text-[#9CA3AF] mt-2" style={{ fontSize: 10, fontFamily: 'Inter, -apple-system, sans-serif' }}>
              AI responses are for guidance only · Not a substitute for legal counsel
            </p>
          </div>
        </>
      ) : (
        /* Insights tab */
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* Evidence checklist */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F3F4F6]">
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Evidence Checklist</p>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${(completedCount / CHECKLIST.length) * 100}%` }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>{completedCount}/{CHECKLIST.length}</span>
              </div>
            </div>
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#F9FAFB] last:border-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: item.done ? '#16A34A' : '#E5E7EB' }}
                >
                  {item.done && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <p style={{ fontSize: 13, color: item.done ? '#111827' : '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.label}</p>
                {!item.done && (
                  <div className="ml-auto px-2 py-0.5 rounded-full bg-[#FEF3C7]">
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#D97706', fontFamily: 'Inter, -apple-system, sans-serif' }}>Missing</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Next recommended step */}
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} color="#4F46E5" strokeWidth={2} />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Next Recommended Step</p>
            </div>
            <div className="flex items-start gap-3 px-3 py-3 rounded-xl bg-[#EEF2FF]">
              <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                <span style={{ fontSize: 11, fontWeight: 800, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>01</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>File HR Complaint Under PAWWA 2010</p>
                <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5, marginTop: 2 }}>
                  Submit written complaint to your company's Inquiry Committee. They are legally required to acknowledge within 3 working days.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline preview */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F3F4F6]">
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Case Timeline</p>
              <button onClick={() => navigate('timeline')} style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>View full →</button>
            </div>
            {[
              { date: 'Jul 18', label: 'Report filed · AI analysis completed', color: '#4F46E5' },
              { date: 'Jul 16', label: 'Security footage submitted to vault', color: '#16A34A' },
              { date: 'Jul 15', label: 'First incident documented & recorded', color: '#D97706' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#F9FAFB] last:border-0">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: event.color, width: 8, height: 8 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', width: 36, flexShrink: 0 }}>{event.date}</span>
                <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>{event.label}</p>
              </div>
            ))}
          </div>

          {/* Risk summary */}
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
            <div className="flex items-center gap-2 mb-3">
              <Scale size={16} color="#D97706" strokeWidth={2} />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Risk Summary</p>
            </div>
            {[
              { label: 'Legal case strength', value: 78, color: '#4F46E5' },
              { label: 'Evidence completeness', value: 71, color: '#16A34A' },
              { label: 'Filing urgency', value: 60, color: '#D97706' },
            ].map((item) => (
              <div key={item.label} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.value}%</span>
                </div>
                <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="h-2" />
        </div>
      )}
    </div>
  )
}
