interface StatusBarProps {
  dark?: boolean
}

export default function StatusBar({ dark = false }: StatusBarProps) {
  const color = dark ? 'text-white' : 'text-[#111827]'
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 ${color}`} style={{ fontSize: 12, fontWeight: 600 }}>
      <span style={{ letterSpacing: '0.02em' }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="3" width="3" height="9" rx="0.5" opacity="0.4" />
          <rect x="4.5" y="2" width="3" height="10" rx="0.5" opacity="0.6" />
          <rect x="9" y="0" width="3" height="12" rx="0.5" opacity="0.8" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.5C10.5 2.5 12.7 3.6 14.2 5.3L15.5 4C13.6 1.9 11 0.5 8 0.5C5 0.5 2.4 1.9 0.5 4L1.8 5.3C3.3 3.6 5.5 2.5 8 2.5Z" opacity="0.4" />
          <path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.4L13.6 6.1C12.1 4.5 10.2 3.5 8 3.5C5.8 3.5 3.9 4.5 2.4 6.1L3.7 7.4C4.8 6.2 6.3 5.5 8 5.5Z" opacity="0.7" />
          <path d="M8 8.5C9 8.5 9.9 8.9 10.5 9.6L11.8 8.3C10.8 7.2 9.5 6.5 8 6.5C6.5 6.5 5.2 7.2 4.2 8.3L5.5 9.6C6.1 8.9 7 8.5 8 8.5Z" opacity="0.9" />
          <circle cx="8" cy="11" r="1" />
        </svg>
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-3 rounded-sm border border-current opacity-80 flex items-center px-0.5">
            <div className="bg-current rounded-sm h-2 w-4" style={{ opacity: 0.9 }} />
          </div>
          <div className="w-0.5 h-1.5 rounded-full bg-current opacity-60" />
        </div>
      </div>
    </div>
  )
}
