import { ChevronLeft, Bell, Shield, Brain, AlertCircle, FileText } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const notifications = [
  { icon: Brain, color: '#4F46E5', bg: '#EEF2FF', title: 'AI Analysis Complete', desc: 'Your case strength report for Workplace Harassment is ready.', time: 'Just now', unread: true },
  { icon: Shield, color: '#16A34A', bg: '#F0FDF4', title: 'Evidence Encrypted', desc: 'Security_footage.mp4 has been securely stored in your vault.', time: '1h ago', unread: true },
  { icon: AlertCircle, color: '#D97706', bg: '#FEF3C7', title: 'Filing Deadline Reminder', desc: 'You have 72 days remaining to file your case under PAWWA 2010.', time: '3h ago', unread: true },
  { icon: FileText, color: '#7C3AED', bg: '#F5F3FF', title: 'Complaint Draft Ready', desc: 'Your AI-generated complaint is ready for review and submission.', time: 'Yesterday', unread: false },
  { icon: Bell, color: '#EC4899', bg: '#FDF2F8', title: 'Safety Tip', desc: 'Keep a physical copy of all filed complaints in a safe location.', time: 'Yesterday', unread: false },
  { icon: Shield, color: '#16A34A', bg: '#F0FDF4', title: 'New Resource Available', desc: 'Updated legal guide: PECA 2016 amendments explained.', time: '2 days ago', unread: false },
]

export default function NotificationsScreen({ goBack }: NavProps) {
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
              <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Notifications</h1>
            </div>
            <button className="text-[#4F46E5]" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Inter, -apple-system, sans-serif' }}>Mark all read</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[#6B7280] mb-3" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Today</p>
        <div className="flex flex-col gap-2.5">
          {notifications.map((notif, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-4 py-4 flex items-start gap-3 shadow-sm"
              style={{ border: `1px solid ${notif.unread ? '#EEF2FF' : '#F3F4F6'}`, background: notif.unread ? '#FAFBFF' : 'white' }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: notif.bg }}>
                <notif.icon size={18} color={notif.color} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: notif.unread ? 700 : 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{notif.title}</p>
                  {notif.unread && <div className="w-2 h-2 rounded-full bg-[#4F46E5] flex-shrink-0 mt-1" />}
                </div>
                <p className="text-[#6B7280] mt-1" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{notif.desc}</p>
                <p className="text-[#9CA3AF] mt-1.5" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}
