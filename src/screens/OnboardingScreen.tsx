import { useState } from 'react'
import { ChevronRight, Shield, Brain, BookOpen } from 'lucide-react'
import type { NavProps } from '../types'

const slides = [
  {
    icon: Shield,
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    title: 'Document Safely',
    subtitle: 'Secure incident reporting',
    desc: 'Record incidents of harassment, violence, and abuse with encrypted storage. Your evidence stays private and protected.',
    accent: '#4F46E5',
  },
  {
    icon: Brain,
    iconBg: '#FDF2F8',
    iconColor: '#EC4899',
    title: 'AI-Powered Support',
    subtitle: 'Intelligent case analysis',
    desc: 'Our AI assistant helps you organize evidence, understand legal options, and generate professional complaint documents.',
    accent: '#EC4899',
  },
  {
    icon: BookOpen,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    title: 'Know Your Rights',
    subtitle: 'Legal guidance & resources',
    desc: 'Access verified legal information, connect with emergency services, and find nearby women protection centers.',
    accent: '#16A34A',
  },
]

export default function OnboardingScreen({ navigate }: NavProps) {
  const [idx, setIdx] = useState(0)
  const slide = slides[idx]
  const Icon = slide.icon

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={() => navigate('language')}
          className="text-[#6B7280]"
          style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
          Skip
        </button>
      </div>

      {/* Illustration area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4">
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center mb-10 shadow-sm"
          style={{ background: slide.iconBg }}
        >
          <Icon size={52} color={slide.iconColor} strokeWidth={1.5} />
        </div>

        <div className="text-center">
          <p
            className="mb-2"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: slide.accent,
              fontFamily: 'Inter, -apple-system, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            {slide.subtitle}
          </p>
          <h2
            className="text-[#111827] mb-4"
            style={{
              fontSize: 30,
              fontWeight: 800,
              fontFamily: 'Inter, -apple-system, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {slide.title}
          </h2>
          <p
            className="text-[#6B7280] leading-relaxed px-2"
            style={{ fontSize: 15, fontWeight: 400, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.65 }}
          >
            {slide.desc}
          </p>
        </div>
      </div>

      {/* Dots + CTA */}
      <div className="px-6 pb-10">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all cursor-pointer"
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                background: i === idx ? slide.accent : '#E5E7EB',
              }}
            />
          ))}
        </div>

        {idx < slides.length - 1 ? (
          <button
            onClick={() => setIdx(idx + 1)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl text-white font-semibold transition-all active:scale-95"
            style={{
              height: 54,
              background: slide.accent,
              fontSize: 16,
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Continue
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={() => navigate('language')}
            className="w-full flex items-center justify-center gap-2 rounded-2xl text-white font-semibold transition-all active:scale-95"
            style={{
              height: 54,
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              fontSize: 16,
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontWeight: 600,
            }}
          >
            Get Started
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}
