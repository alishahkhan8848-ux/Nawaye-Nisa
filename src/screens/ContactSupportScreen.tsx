import { useState } from 'react'
import { ChevronLeft, MessageCircle, Phone, Mail, ChevronRight, Send } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const faqs = [
  { q: 'Is my data completely private?', a: 'Yes. All data is end-to-end encrypted. We cannot access your information.' },
  { q: 'Can I use this app anonymously?', a: 'You can report without sharing personal details. Phone verification is optional.' },
  { q: 'What languages are supported?', a: 'Urdu, English, Punjabi, Sindhi, Pashto, Balochi, and Shina.' },
  { q: 'Will my reports go to police automatically?', a: 'No. Reports are stored locally. You control when and if they are shared.' },
]

export default function ContactSupportScreen({ goBack }: NavProps) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Contact Support</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Contact options */}
        <div className="flex flex-col gap-3 mb-6">
          {[
            { icon: MessageCircle, label: 'Live Chat', sublabel: 'Usually responds within 30 minutes', color: '#4F46E5', bg: '#EEF2FF', available: true },
            { icon: Mail, label: 'Email Support', sublabel: 'support@nawaynisa.pk', color: '#EC4899', bg: '#FDF2F8', available: true },
            { icon: Phone, label: 'Helpline', sublabel: '0800-NISA (6472) · Free, 24/7', color: '#16A34A', bg: '#F0FDF4', available: true },
          ].map((opt) => (
            <button
              key={opt.label}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white shadow-sm text-left w-full transition-all active:scale-[0.98]"
              style={{ border: '1px solid #F3F4F6' }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: opt.bg }}>
                <opt.icon size={22} color={opt.color} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[#111827]" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>{opt.label}</p>
                <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>{opt.sublabel}</p>
              </div>
              {opt.available && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span style={{ fontSize: 11, color: '#16A34A', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500 }}>Online</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Send message */}
        <div className="bg-white rounded-2xl px-5 py-5 mb-5 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          <p className="text-[#111827] mb-4" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Send a Message</p>
          {sent ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-3">
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <path d="M2 9L8.5 15.5L22 2" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[#111827]" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Message Sent!</p>
              <p className="text-[#6B7280] mt-1" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}>We'll respond within 30 minutes</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[#374151] mb-1.5" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>Subject</label>
                  <select
                    className="w-full rounded-2xl border px-4 outline-none text-[#111827] bg-[#FAFAFA] appearance-none"
                    style={{ height: 46, fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB' }}
                  >
                    <option>Technical Issue</option>
                    <option>Account Help</option>
                    <option>Report a Problem</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#374151] mb-1.5" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    className="w-full rounded-2xl border px-4 py-3 outline-none text-[#111827] bg-[#FAFAFA] resize-none"
                    style={{ minHeight: 100, fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB', lineHeight: 1.6 }}
                  />
                </div>
                <button
                  onClick={() => message && setSent(true)}
                  className="w-full rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    height: 48,
                    background: message ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : '#E5E7EB',
                    fontSize: 15,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    fontWeight: 600,
                    color: message ? 'white' : '#9CA3AF',
                  }}
                >
                  <Send size={16} strokeWidth={2} />
                  Send Message
                </button>
              </div>
            </>
          )}
        </div>

        {/* FAQs */}
        <p className="text-[#111827] mb-3" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Frequently Asked Questions</p>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#F3F4F6] last:border-0">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
              >
                <p className="text-[#111827] flex-1 pr-3" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.4 }}>{faq.q}</p>
                <ChevronRight
                  size={16}
                  color="#9CA3AF"
                  style={{ transform: expanded === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                  className="flex-shrink-0"
                />
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 -mt-2">
                  <p className="text-[#6B7280]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
