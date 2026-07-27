import { ChevronLeft, Shield, Brain, Heart, Globe } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

export default function AboutScreen({ goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>About Nawaye Nisa</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Logo section */}
        <div className="flex flex-col items-center py-8 bg-white rounded-2xl mb-5 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #312E81, #4F46E5)' }}
          >
            <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
              <path d="M26 8C26 8 14 16 14 28C14 34.627 19.373 40 26 40C32.627 40 38 34.627 38 28C38 16 26 8 26 8Z" fill="white" opacity="0.95" />
              <circle cx="26" cy="28" r="5" fill="#4F46E5" />
            </svg>
          </div>
          <h2 className="text-[#111827]" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>Nawaye Nisa</h2>
          <p className="text-[#6B7280]" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}>نوائے نسا</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#EEF2FF]">
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>Version 1.0.0</span>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl px-5 py-5 mb-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Our Mission</p>
          <p className="text-[#374151]" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.75 }}>
            Nawaye Nisa (Voice of Women) is Pakistan's first AI-powered survivor support platform. We believe every woman deserves to be heard, protected, and supported.
          </p>
          <p className="text-[#374151] mt-3" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.75 }}>
            Our platform empowers survivors by making the legal documentation process accessible, dignified, and secure — in languages they understand, from a device they carry.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl px-5 py-5 mb-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>What We Offer</p>
          {[
            { icon: Shield, color: '#4F46E5', bg: '#EEF2FF', label: 'Secure Incident Documentation' },
            { icon: Brain, color: '#EC4899', bg: '#FDF2F8', label: 'AI-Powered Legal Analysis' },
            { icon: Globe, color: '#16A34A', bg: '#F0FDF4', label: 'Multilingual Support (7 languages)' },
            { icon: Heart, color: '#DC2626', bg: '#FEF2F2', label: 'Trauma-Informed User Experience' },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: feature.bg }}>
                <feature.icon size={16} color={feature.color} strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>{feature.label}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="bg-white rounded-2xl px-5 py-4 mb-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-3" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Partners & Supporters</p>
          {['UN Women Pakistan', 'AGHS Legal Aid Cell', 'Aurat Foundation', 'Digital Rights Foundation'].map((partner) => (
            <div key={partner} className="py-2 border-b border-[#F3F4F6] last:border-0">
              <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>{partner}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
          © 2025 Nawaye Nisa. All rights reserved.{'\n'}
          Made with care for survivors of Pakistan.
        </p>

        <div className="h-4" />
      </div>
    </div>
  )
}
