import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'
import { getDistricts, getProvinces, getTehsils } from '../lib/pakistanLocations'

interface DropdownFieldProps {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}
function DropdownField({ label, value, options, onChange, placeholder = 'Select', disabled = false, required, error }: DropdownFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.01em' }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className="w-full flex items-center justify-between rounded-2xl border px-4 text-left transition-all"
        style={{
          height: 50,
          background: disabled ? '#F9FAFB' : open ? '#FAFBFF' : '#FAFAFA',
          borderColor: error ? '#FCA5A5' : open ? '#4F46E5' : disabled ? '#F3F4F6' : '#E5E7EB',
          borderWidth: open ? 1.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <span style={{
          fontSize: 14,
          fontFamily: 'Inter, -apple-system, sans-serif',
          color: value ? '#111827' : '#9CA3AF',
          fontWeight: value ? 500 : 400,
        }}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          color={open ? '#4F46E5' : '#9CA3AF'}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 rounded-2xl shadow-xl overflow-hidden"
          style={{ top: 'calc(100% + 6px)', background: 'white', border: '1.5px solid #E5E7EB', maxHeight: 240 }}
        >
          {options.length > 5 && (
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 bg-[#FAFAFA]" style={{ height: 36 }}>
                <Search size={13} color="#9CA3AF" strokeWidth={2} />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-[#111827]"
                  style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto" style={{ maxHeight: options.length > 5 ? 190 : 240 }}>
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); setSearch('') }}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:bg-[#F8F9FF]"
                style={{ borderBottom: '1px solid #F9FAFB' }}
              >
                <span style={{ fontSize: 14, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: value === opt ? 600 : 400 }}>
                  {opt}
                </span>
                {value === opt && <Check size={14} color="#4F46E5" strokeWidth={2.5} />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-5 text-center">
                <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
      {error && (
        <p className="mt-1.5" style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export interface PakistanLocationValue {
  province: string
  district: string
  tehsil: string
}

interface PakistanLocationSelectProps {
  value: PakistanLocationValue
  onChange: (value: PakistanLocationValue) => void
  errors?: Partial<Record<'province' | 'district' | 'tehsil', string>>
}

/** Fully dependent Province -> District -> Tehsil selector backed by the complete Pakistan location dataset. */
export default function PakistanLocationSelect({ value, onChange, errors }: PakistanLocationSelectProps) {
  const provinces = getProvinces()
  const districts = getDistricts(value.province)
  const tehsils = getTehsils(value.province, value.district)
  

  const handleProvinceChange = (province: string) => {
    // Changing the province resets district and tehsil, since they no longer apply.
    onChange({ province, district: '', tehsil: '' })
  }

  const handleDistrictChange = (district: string) => {
    // Changing the district resets tehsil, since the tehsil list depends on it.
    onChange({ ...value, district, tehsil: '' })
  }

  const handleTehsilChange = (tehsil: string) => {
    onChange({ ...value, tehsil })
  }

  return (
    <div className="flex flex-col gap-4">
      <DropdownField
        label="Province"
        value={value.province}
        options={provinces}
        onChange={handleProvinceChange}
        placeholder="Select province"
        required
        error={errors?.province}
      />
      <DropdownField
        label="District"
        value={value.district}
        options={districts}
        onChange={handleDistrictChange}
        placeholder={value.province ? 'Select district' : 'Select a province first'}
        disabled={!value.province}
        required
        error={errors?.district}
      />
      <DropdownField
        label="Tehsil"
        value={value.tehsil}
        options={tehsils}
        onChange={handleTehsilChange}
        placeholder={value.district ? 'Select tehsil' : 'Select a district first'}
        disabled={!value.district}
        required
        error={errors?.tehsil}
      />
    </div>
  )
}