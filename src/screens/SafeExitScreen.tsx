import { useState } from 'react'
import { ChevronLeft, LogOut, ExternalLink } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const disguises = [
  { label: 'Weather App', icon: '🌤', desc: 'Shows weather for Lahore' },
  { label: 'Calculator', icon: '🔢', desc: 'Standard calculator' },
  { label: 'Clock App', icon: '🕐', desc: 'World clock display' },
  { label: 'Notes App', icon: '📝', desc: 'Blank notes screen' },
]

export default function SafeExitScreen({ navigate, goBack }: NavProps) {
  const [selected, setSelected] = useState('Weather App')
  const [exiting, setExiting] = useState(false)

  const handleExit = () => {
    setExiting(true)
    setTimeout(() => setExiting(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="px-5 pt-3 pb-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Safe Exit</h1>
            <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Quickly hide this app</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5">
        {/* Explanation */}
        <div className="bg-[#F0FDF4] rounded-2xl px-4 py-4 flex gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
            <LogOut size={16} color="#16A34A" strokeWidth={2} />
          </div>
          <p className="text-[#166534]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
            Safe Exit hides the Nawaye Nisa app and shows a different screen. Your data remains safe and hidden. Use this if someone is watching your phone.
          </p>
        </div>

        {/* Choose disguise */}
        <div>
          <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Disguise App</p>
          <div className="grid grid-cols-2 gap-3">
            {disguises.map((d) => (
              <button
                key={d.label}
                onClick={() => setSelected(d.label)}
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all text-center"
                style={{
                  background: selected === d.label ? '#EEF2FF' : '#FAFAFA',
                  borderColor: selected === d.label ? '#4F46E5' : '#E5E7EB',
                }}
              >
                <span style={{ fontSize: 28 }}>{d.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{d.label}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{d.desc}</p>
                </div>
                {selected === d.label && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L2.8 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick tips */}
        <div className="bg-[#FEF3C7] rounded-2xl px-4 py-3.5">
          <p className="text-[#92400E]" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Safety Tips</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {[
              'Triple-press home button to activate Safe Exit',
              'Your reports and evidence are hidden but preserved',
              'Return with your Emergency PIN',
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 flex-shrink-0" />
                <p style={{ fontSize: 12, color: '#92400E', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 border-t border-[#F3F4F6]">
        <button
          onClick={handleExit}
          className="w-full rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{
            height: 54,
            background: exiting ? '#16A34A' : 'linear-gradient(135deg, #16A34A, #15803D)',
            fontSize: 16,
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontWeight: 700,
          }}
        >
          <LogOut size={20} strokeWidth={2} />
          {exiting ? 'Exiting Safely...' : `Exit to ${selected}`}
        </button>
        <p className="text-center text-[#9CA3AF] mt-3" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>
          Your data is safe. Return with your Emergency PIN.
        </p>
      </div>
    </div>
  )
}
