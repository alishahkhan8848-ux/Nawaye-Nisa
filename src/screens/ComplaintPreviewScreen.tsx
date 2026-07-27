import { ChevronLeft, Download, Share2, Send, FileText, Check } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

export default function ComplaintPreviewScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Complaint Draft</h1>
              <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>AI-generated · Ready to review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Status badges */}
        <div className="flex gap-2 mb-4">
          {[
            { label: 'AI Generated', color: '#4F46E5', bg: '#EEF2FF' },
            { label: 'Urdu Available', color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Draft', color: '#D97706', bg: '#FEF3C7' },
          ].map((badge) => (
            <div key={badge.label} className="px-2.5 py-1 rounded-full" style={{ background: badge.bg }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: badge.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Document preview */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
          {/* Doc header */}
          <div className="bg-[#111827] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-white/10">
                <FileText size={16} color="white" strokeWidth={1.8} />
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/30" />
                <div className="w-3 h-3 rounded-full bg-white/50" />
              </div>
            </div>
          </div>

          {/* Document content */}
          <div className="px-5 py-5">
            <div className="text-center mb-6">
              <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
                FORMAL COMPLAINT
              </p>
              <p className="text-[#6B7280] mt-1" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Under Protection Against Harassment of Women at Workplace Act, 2010
              </p>
              <div className="w-12 h-0.5 bg-[#4F46E5] mx-auto mt-3" />
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: 'To', value: 'The Inquiry Committee / FIA Cybercrime Wing' },
                { label: 'Date', value: 'July 18, 2025' },
                { label: 'Reference', value: 'NWN-2025-0318' },
              ].map((row) => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-[#6B7280] w-16 flex-shrink-0" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 600 }}>{row.label}:</span>
                  <span className="text-[#111827]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-[#111827] mb-2" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Subject:</p>
              <p className="text-[#374151]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.7 }}>
                Formal complaint regarding workplace harassment, intimidation, and cyberstalking by Mr. [Respondent Name], Senior Manager, XYZ Corporation, Lahore.
              </p>
            </div>

            <div className="mb-5">
              <p className="text-[#111827] mb-2" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Respectfully,</p>
              <p className="text-[#374151]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.8 }}>
                I, Fatima Khan, daughter of Muhammad Khan, residing at [Address], Lahore, Pakistan (CNIC: XXXXX-XXXXXXX-X), hereby file this formal complaint against [Respondent], employed as Senior Manager at XYZ Corporation.
              </p>
            </div>

            <div className="mb-5">
              <p className="text-[#111827] mb-2" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Facts of the Case:</p>
              <p className="text-[#374151]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.8 }}>
                1. On June 28, 2025, the respondent made inappropriate remarks during a lunch meeting witnessed by colleagues.<br /><br />
                2. On July 15, 2025, at approximately 09:00 AM, the respondent verbally threatened the complainant in his office. An audio recording was captured.<br /><br />
                3. Between July 16-18, 2025, the respondent sent threatening messages via WhatsApp, copies of which are preserved as evidence.
              </p>
            </div>

            <div className="mb-5">
              <p className="text-[#111827] mb-2" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Evidence Attached:</p>
              {[
                '8 Screenshots with verified timestamps',
                'Audio recording (0:23)',
                'Security footage (CCTV)',
                'Witness statements (2 colleagues)',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <Check size={9} color="#4F46E5" strokeWidth={3} />
                  </div>
                  <p className="text-[#374151]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>{item}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-[#111827] mb-2" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Prayer:</p>
              <p className="text-[#374151]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.8 }}>
                It is humbly requested that appropriate legal action be taken against the respondent under PAWWA 2010 and PECA 2016, and that the complainant be provided protection.
              </p>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4">
              <p className="text-[#111827]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Sincerely,</p>
              <p className="text-[#111827] mt-4" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Fatima Khan</p>
              <p className="text-[#6B7280]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>Complainant · July 18, 2025</p>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Bottom actions */}
      <div className="px-5 py-4 border-t border-[#F3F4F6] bg-white flex gap-3">
        <button
          className="flex items-center justify-center gap-2 px-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
          style={{ height: 52, fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
          <Download size={16} strokeWidth={1.8} />
          PDF
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
          style={{ height: 52, fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
          <Share2 size={16} strokeWidth={1.8} />
          Share
        </button>
        <button
          className="flex-1 rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{
            height: 52,
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            fontSize: 14,
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontWeight: 600,
          }}
        >
          <Send size={16} strokeWidth={2} />
          Submit
        </button>
      </div>
    </div>
  )
}
