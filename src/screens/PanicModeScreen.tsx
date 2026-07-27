import { useState } from 'react'
import { ChevronLeft, AlertTriangle, Phone, MapPin, Users, X } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

export default function PanicModeScreen({ navigate, goBack }: NavProps) {
  const [activated, setActivated] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const activate = () => {
    setActivated(true)
    let c = 5
    const t = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c <= 0) clearInterval(t)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: activated ? '#DC2626' : 'white' }}>
      <div style={{ background: activated ? '#DC2626' : 'white' }}>
        <StatusBar dark={activated} />
      </div>

      {activated ? (
        // Panic active state
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
            <AlertTriangle size={48} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-white" style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
            PANIC MODE ACTIVE
          </h1>
          <p className="text-white/80 mt-3" style={{ fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
            Alerting your trusted contacts and sharing your live location
          </p>

          <div className="mt-8 flex flex-col gap-3 w-full">
            {[
              { label: 'Amina Siddiqui notified', sub: 'Message + location sent · 2s ago', done: true },
              { label: 'Sara Ahmed notified', sub: 'Message + location sent · 2s ago', done: true },
              { label: 'Calling Police (15)', sub: 'Connecting...', done: countdown <= 3 },
            ].map((item) => (
              <div key={item.label} className="bg-white/15 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }}
                >
                  {item.done ? (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1.5 5.5L5 9L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.label}</p>
                  <p className="text-white/70" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActivated(false)}
            className="mt-8 w-full py-4 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center gap-2"
          >
            <X size={18} color="white" strokeWidth={2.5} />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Inter, -apple-system, sans-serif' }}>Cancel Panic Mode</span>
          </button>
        </div>
      ) : (
        // Normal state
        <div className="flex flex-col h-full">
          <div className="px-5 pt-3 pb-4 border-b border-[#F3F4F6]">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
                <ChevronLeft size={20} color="#111827" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Panic Mode</h1>
                <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Emergency silent alert system</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 py-5 flex flex-col gap-5">
            {/* What it does */}
            <div className="bg-[#FEF2F2] rounded-2xl px-4 py-4">
              <p className="text-[#DC2626]" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>When activated, Panic Mode will:</p>
              <div className="mt-3 flex flex-col gap-2.5">
                {[
                  { icon: Users, label: 'Alert 2 trusted contacts with your location', color: '#DC2626' },
                  { icon: MapPin, label: 'Share live GPS location for 60 minutes', color: '#DC2626' },
                  { icon: Phone, label: 'Initiate call to police helpline (15)', color: '#DC2626' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} color={item.color} strokeWidth={2} />
                    </div>
                    <p style={{ fontSize: 13, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contacts that will be alerted */}
            <div>
              <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Contacts to Alert</p>
              {['Amina Siddiqui · Sister', 'Sara Ahmed · Best Friend'].map((c) => (
                <div key={c} className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl mb-2 border border-[#F3F4F6]">
                  <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>{c[0]}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{c}</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                </div>
              ))}
              <button
                onClick={() => navigate('trusted-contacts')}
                className="text-[#4F46E5] mt-1"
                style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                + Add more contacts
              </button>
            </div>

            {/* Activation methods */}
            <div className="bg-[#F8FAFC] rounded-2xl px-4 py-3.5" style={{ border: '1px solid #E5E7EB' }}>
              <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Quick Activation Methods</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {['Shake phone rapidly 3 times', 'Press power button 5 times', 'Tap the button below'].map((m) => (
                  <div key={m} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]" />
                    <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 pb-8 pt-4 border-t border-[#F3F4F6]">
            <button
              onClick={activate}
              className="w-full rounded-2xl text-white flex items-center justify-center gap-3 transition-all active:scale-95"
              style={{
                height: 60,
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                fontSize: 17,
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.01em',
              }}
            >
              <AlertTriangle size={22} strokeWidth={2.5} />
              ACTIVATE PANIC MODE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
