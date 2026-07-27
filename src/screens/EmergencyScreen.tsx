import { Phone, ChevronRight, MapPin, Users, Shield, LogOut } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

export default function EmergencyScreen({ navigate }: NavProps) {
  const emergencyContacts = [
    { label: 'Police', number: '15', desc: 'Pakistan Police Emergency', color: '#1D4ED8', bg: '#EFF6FF', icon: '🚔' },
    { label: 'Ambulance', number: '1122', desc: 'Emergency Medical Services', color: '#DC2626', bg: '#FEF2F2', icon: '🚑' },
    { label: 'Rescue', number: '1122', desc: 'Rescue & Fire Services', color: '#D97706', bg: '#FEF3C7', icon: '🚒' },
    { label: 'Women Helpline', number: '1099', desc: 'National Women Helpline', color: '#EC4899', bg: '#FDF2F8', icon: '👩' },
    { label: 'Child Protection', number: '1121', desc: 'Child Protection Bureau', color: '#7C3AED', bg: '#F5F3FF', icon: '🛡' },
    { label: 'Edhi Foundation', number: '115', desc: '24/7 Emergency Services', color: '#16A34A', bg: '#F0FDF4', icon: '🏥' },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4">
          <h1 className="text-[#111827]" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>Emergency Center</h1>
          <p className="text-[#6B7280]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}>Quick access to help and safety</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {/* SOS Button */}
        <button className="w-full rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', minHeight: 140 }}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Phone size={32} color="white" strokeWidth={2} />
          </div>
          <div className="text-center">
            <p className="text-white" style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>SOS EMERGENCY</p>
            <p className="text-white/80" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Hold 3 seconds to alert trusted contacts + call 15</p>
          </div>
        </button>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('trusted-contacts')}
            className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95"
            style={{ border: '1px solid #F3F4F6' }}
          >
            <Users size={22} color="#4F46E5" strokeWidth={1.8} />
            <p className="text-[#111827]" style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>Trusted</p>
            <p className="text-[#6B7280]" style={{ fontSize: 10, fontFamily: 'Inter, -apple-system, sans-serif' }}>Contacts</p>
          </button>
          <button
            onClick={() => navigate('nearby-help')}
            className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95"
            style={{ border: '1px solid #F3F4F6' }}
          >
            <MapPin size={22} color="#EC4899" strokeWidth={1.8} />
            <p className="text-[#111827]" style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>Nearby</p>
            <p className="text-[#6B7280]" style={{ fontSize: 10, fontFamily: 'Inter, -apple-system, sans-serif' }}>Shelters</p>
          </button>
          <button
            onClick={() => navigate('safe-exit')}
            className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm transition-all active:scale-95"
            style={{ border: '1px solid #F3F4F6' }}
          >
            <LogOut size={22} color="#16A34A" strokeWidth={1.8} />
            <p className="text-[#111827]" style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>Safe</p>
            <p className="text-[#6B7280]" style={{ fontSize: 10, fontFamily: 'Inter, -apple-system, sans-serif' }}>Exit</p>
          </button>
        </div>

        {/* Panic mode */}
        <button
          onClick={() => navigate('panic-mode')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
        >
          <div className="w-11 h-11 rounded-2xl bg-[#DC2626] flex items-center justify-center flex-shrink-0">
            <Shield size={20} color="white" strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#DC2626]" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Panic Mode</p>
            <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Silently alert contacts & share location</p>
          </div>
          <ChevronRight size={16} color="#DC2626" />
        </button>

        {/* Emergency contacts */}
        <div>
          <p className="text-[#111827] mb-3" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Emergency Numbers</p>
          <div className="flex flex-col gap-2.5">
            {emergencyContacts.map((contact) => (
              <button
                key={contact.label}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98] text-left w-full"
                style={{ border: '1px solid #F3F4F6' }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: contact.bg }}>
                  {contact.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[#111827]" style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{contact.label}</p>
                  <p className="text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{contact.desc}</p>
                </div>
                <div
                  className="flex items-center justify-center rounded-xl px-3 py-2"
                  style={{ background: contact.bg }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: contact.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{contact.number}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Women Protection Centers */}
        <div>
          <p className="text-[#111827] mb-3" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Women Protection Centers</p>
          {[
            { name: 'Dar-ul-Aman Lahore', address: 'Hall Road, Lahore', dist: '2.4 km', open: true },
            { name: 'Panah Shelter Karachi', address: 'Saddar, Karachi', dist: '5.1 km', open: true },
            { name: 'Dastak Lahore', address: 'Gulberg III, Lahore', dist: '3.8 km', open: false },
          ].map((center) => (
            <div key={center.name} className="bg-white rounded-2xl px-4 py-3.5 mb-2.5 flex items-center gap-3 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] flex items-center justify-center flex-shrink-0">
                <Shield size={18} color="#EC4899" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{center.name}</p>
                <p className="text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{center.address}</p>
              </div>
              <div className="text-right">
                <p className="text-[#374151]" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{center.dist}</p>
                <div className={`px-2 py-0.5 rounded-full mt-0.5 ${center.open ? 'bg-[#F0FDF4]' : 'bg-[#F3F4F6]'}`}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: center.open ? '#16A34A' : '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                    {center.open ? 'Open 24/7' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-2" />
      </div>
    </div>
  )
}
