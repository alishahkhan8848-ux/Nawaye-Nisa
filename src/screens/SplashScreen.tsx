import type { NavProps } from '../types'
import { useEffect } from 'react'

export default function SplashScreen({ navigate }: NavProps) {
  useEffect(() => {
    const t = setTimeout(() => navigate('onboarding'), 2600)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ background: 'linear-gradient(160deg, #312E81 0%, #4F46E5 50%, #6366F1 100%)' }}
    >
      {/* Logo mark */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div
          className="flex items-center justify-center rounded-[28px] shadow-2xl"
          style={{
            width: 96,
            height: 96,
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d="M26 8C26 8 14 16 14 28C14 34.627 19.373 40 26 40C32.627 40 38 34.627 38 28C38 16 26 8 26 8Z"
              fill="white"
              opacity="0.95"
            />
            <path
              d="M26 16C26 16 20 21.5 20 28C20 31.314 22.686 34 26 34C29.314 34 32 31.314 32 28C32 21.5 26 16 26 16Z"
              fill="#4F46E5"
            />
            <circle cx="26" cy="28" r="4" fill="white" />
          </svg>
        </div>

        <div className="text-center">
          <h1
            className="text-white"
            style={{
              fontSize: 32,
              fontWeight: 800,
              fontFamily: 'Inter, -apple-system, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Nawaye Nisa
          </h1>
          <p
            className="text-white/70 mt-2"
            style={{ fontSize: 14, fontWeight: 400, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.08em' }}
          >
            نوائے نسا
          </p>
        </div>

        <p
          className="text-white/60 text-center px-8 mt-2"
          style={{ fontSize: 13, fontWeight: 400, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}
        >
          Pakistan's First AI-Powered<br />Survivor Support Platform
        </p>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-14 flex flex-col items-center gap-3">
        <div className="w-8 h-0.5 bg-white/20 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="text-white/40 mt-2" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
          Supported by UN Women Pakistan
        </p>
      </div>
    </div>
  )
}
