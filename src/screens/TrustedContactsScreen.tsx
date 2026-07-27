import { useState } from 'react'
import { ChevronLeft, Plus, Phone, MessageCircle, Trash2, User } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const contacts = [
  { name: 'Amina Siddiqui', relation: 'Sister', phone: '+92 300 1234567', initials: 'AS', color: '#4F46E5', bg: '#EEF2FF', alertEnabled: true },
  { name: 'Sara Ahmed', relation: 'Best Friend', phone: '+92 321 9876543', initials: 'SA', color: '#EC4899', bg: '#FDF2F8', alertEnabled: true },
  { name: 'Dr. Nida Khan', relation: 'Therapist', phone: '+92 333 5551234', initials: 'NK', color: '#16A34A', bg: '#F0FDF4', alertEnabled: false },
]

export default function TrustedContactsScreen({ navigate, goBack }: NavProps) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
                <ChevronLeft size={20} color="#111827" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Trusted Contacts</h1>
                <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>3 contacts · 2 with SOS alerts</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center"
            >
              <Plus size={18} color="white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="bg-[#EEF2FF] rounded-2xl px-4 py-3.5 mb-5">
          <p className="text-[#4F46E5]" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>SOS Alert System</p>
          <p className="text-[#374151] mt-1" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
            In Panic Mode, contacts with SOS alerts enabled will receive your live location and a distress message automatically.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {contacts.map((contact) => (
            <div key={contact.name} className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: contact.bg }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: contact.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{contact.initials}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#111827]" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>{contact.name}</p>
                  <p className="text-[#9CA3AF]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>{contact.relation} · {contact.phone}</p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full"
                  style={{ background: contact.alertEnabled ? '#F0FDF4' : '#F3F4F6' }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: contact.alertEnabled ? '#16A34A' : '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                    {contact.alertEnabled ? 'SOS On' : 'SOS Off'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#EEF2FF] transition-all active:scale-95">
                  <Phone size={14} color="#4F46E5" strokeWidth={2} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>Call</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F0FDF4] transition-all active:scale-95">
                  <MessageCircle size={14} color="#16A34A" strokeWidth={2} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', fontFamily: 'Inter, -apple-system, sans-serif' }}>Message</span>
                </button>
                <button className="w-10 flex items-center justify-center py-2.5 rounded-xl bg-[#FEF2F2] transition-all active:scale-95">
                  <Trash2 size={14} color="#DC2626" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="mt-4 bg-white rounded-2xl px-5 py-5 shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <p className="text-[#111827] mb-4" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Add Contact</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Name', placeholder: 'Contact name', icon: User },
                { label: 'Phone', placeholder: '+92 3XX XXXXXXX', icon: Phone },
                { label: 'Relationship', placeholder: 'e.g. Sister, Friend, Doctor', icon: User },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[#374151] mb-1.5" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{field.label}</label>
                  <div className="flex items-center gap-3 rounded-xl border px-3 bg-[#FAFAFA]" style={{ height: 46, borderColor: '#E5E7EB' }}>
                    <field.icon size={15} color="#9CA3AF" strokeWidth={1.8} />
                    <input placeholder={field.placeholder} className="flex-1 bg-transparent outline-none text-[#111827]" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }} />
                  </div>
                </div>
              ))}
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-[#374151]"
                  style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
