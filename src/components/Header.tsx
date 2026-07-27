import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightElement?: React.ReactNode
  dark?: boolean
}

export default function Header({ title, subtitle, onBack, rightElement, dark = false }: HeaderProps) {
  const textColor = dark ? 'text-white' : 'text-[#111827]'
  const subColor = dark ? 'text-white/70' : 'text-[#6B7280]'
  return (
    <div className={`flex items-center justify-between px-5 py-3 ${dark ? '' : 'border-b border-[#F3F4F6]'}`}>
      <div className="flex items-center gap-3 flex-1">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: dark ? 'rgba(255,255,255,0.15)' : '#F9FAFB' }}
          >
            <ChevronLeft size={20} color={dark ? '#fff' : '#111827'} strokeWidth={2} />
          </button>
        )}
        <div>
          <h1
            className={`${textColor} leading-tight`}
            style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.01em' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={subColor} style={{ fontSize: 12, fontWeight: 400, fontFamily: 'Inter, -apple-system, sans-serif' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
    </div>
  )
}
