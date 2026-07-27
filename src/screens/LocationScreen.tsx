import { useState } from 'react'
import { ChevronLeft, Check, ChevronRight } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const data = {
  provinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'AJK', 'Islamabad Capital Territory'],
  divisions: { Punjab: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sahiwal', 'Sargodha', 'Bahawalpur', 'Dera Ghazi Khan'] },
  districts: { Lahore: ['Lahore'] },
  tehsils: { Lahore: ['Lahore City', 'Lahore Cantt', 'Model Town', 'Shalimar', 'Nishtar', 'Raiwind'] },
  cities: { 'Lahore City': ['Lahore', 'Gulberg', 'DHA', 'Johar Town', 'Iqbal Town', 'Garden Town'] },
}

const steps = ['Province', 'Division', 'District', 'Tehsil', 'City']

export default function LocationScreen({ navigate, goBack }: NavProps) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState({ province: '', division: '', district: '', tehsil: '', city: '' })

  const currentList =
    step === 0 ? data.provinces :
    step === 1 ? (data.divisions[selected.province as keyof typeof data.divisions] || ['Division 1', 'Division 2', 'Division 3']) :
    step === 2 ? (['District 1', 'District 2', 'District 3']) :
    step === 3 ? (data.tehsils[selected.district as keyof typeof data.tehsils] || ['Tehsil 1', 'Tehsil 2', 'Tehsil 3']) :
    (data.cities[selected.tehsil as keyof typeof data.cities] || ['City 1', 'City 2', 'City 3'])

  const currentKey = ['province', 'division', 'district', 'tehsil', 'city'][step] as keyof typeof selected
  const currentValue = selected[currentKey]

  const handleSelect = (item: string) => {
    setSelected({ ...selected, [currentKey]: item })
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      <div className="px-5 pt-3 pb-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={step > 0 ? () => setStep(step - 1) : goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Select Location</h1>
            <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Step {step + 1} of {steps.length} · {steps[step]}</p>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <button
                onClick={() => i < step && setStep(i)}
                className="flex items-center gap-1"
              >
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    fontWeight: i === step ? 700 : 400,
                    color: i === step ? '#4F46E5' : i < step ? '#111827' : '#9CA3AF',
                  }}
                >
                  {i < step ? selected[['province', 'division', 'district', 'tehsil', 'city'][i] as keyof typeof selected] || s : s}
                </span>
              </button>
              {i < steps.length - 1 && <ChevronRight size={10} color="#D1D5DB" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-2">
          {currentList.map((item) => {
            const isSelected = currentValue === item
            return (
              <button
                key={item}
                onClick={() => handleSelect(item)}
                className="flex items-center justify-between px-4 py-4 rounded-2xl border transition-all active:scale-[0.98] text-left"
                style={{
                  background: isSelected ? '#EEF2FF' : '#FAFAFA',
                  borderColor: isSelected ? '#4F46E5' : '#E5E7EB',
                  borderWidth: isSelected ? 1.5 : 1,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: isSelected ? 600 : 400, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  {item}
                </span>
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

      {step === steps.length - 1 && selected.city && (
        <div className="px-5 py-5 border-t border-[#F3F4F6]">
          <button
            onClick={goBack}
            className="w-full rounded-2xl text-white flex items-center justify-center transition-all active:scale-95"
            style={{
              height: 54,
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              fontSize: 16,
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontWeight: 600,
            }}
          >
            Confirm Location
          </button>
        </div>
      )}
    </div>
  )
}
