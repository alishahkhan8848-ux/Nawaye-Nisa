import { Check } from 'lucide-react'
import { useState } from 'react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const languages = [
  { code: 'ur', name: 'اردو', label: 'Urdu', region: 'Pakistan', primary: true },
  { code: 'en', name: 'English', label: 'English', region: 'International', primary: false },
  { code: 'pa', name: 'پنجابی', label: 'Punjabi', region: 'Punjab', primary: false },
  { code: 'sd', name: 'سنڌي', label: 'Sindhi', region: 'Sindh', primary: false },
  { code: 'ps', name: 'پښتو', label: 'Pashto', region: 'KPK', primary: false },
  { code: 'bl', name: 'بلوچی', label: 'Balochi', region: 'Balochistan', primary: false },
  { code: 'ks', name: 'شینا', label: 'Shina', region: 'Gilgit-Baltistan', primary: false },
]

export default function LanguageScreen({ navigate }: NavProps) {
  const [selected, setSelected] = useState('ur')

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="px-6 pt-4 pb-6">
        <h1
          className="text-[#111827]"
          style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
        >
          Choose Language
        </h1>
        <p
          className="text-[#6B7280] mt-1"
          style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
          زبان منتخب کریں
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <div className="flex flex-col gap-3">
          {languages.map((lang) => {
            const isSelected = selected === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className="flex items-center justify-between px-5 py-4 rounded-2xl border transition-all text-left active:scale-[0.98]"
                style={{
                  background: isSelected ? '#EEF2FF' : '#FAFAFA',
                  borderColor: isSelected ? '#4F46E5' : '#E5E7EB',
                  borderWidth: isSelected ? 1.5 : 1,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: isSelected ? '#4F46E5' : '#F3F4F6' }}
                  >
                    <span
                      style={{
                        fontSize: lang.code === 'en' ? 12 : 14,
                        fontWeight: 700,
                        color: isSelected ? 'white' : '#6B7280',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                      }}
                    >
                      {lang.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                      }}
                    >
                      {lang.label}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: '#6B7280',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                      }}
                    >
                      {lang.name} · {lang.region}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#4F46E5] flex items-center justify-center">
                    <Check size={14} color="white" strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 py-5 border-t border-[#F3F4F6]">
        <button
          onClick={() => navigate('login')}
          className="w-full rounded-2xl text-white font-semibold transition-all active:scale-95 flex items-center justify-center"
          style={{
            height: 54,
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            fontSize: 16,
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontWeight: 600,
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
