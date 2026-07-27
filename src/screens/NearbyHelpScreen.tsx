import { ChevronLeft, MapPin, Navigation, Phone, Clock } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'

const places = [
  { name: 'Dar-ul-Aman Women Shelter', type: 'Shelter', dist: '2.4 km', address: 'Hall Road, Lahore', phone: '042-99200500', open: true, color: '#EC4899', bg: '#FDF2F8' },
  { name: 'Lahore General Hospital', type: 'Hospital', dist: '3.1 km', address: 'Jail Road, Lahore', phone: '042-99200300', open: true, color: '#DC2626', bg: '#FEF2F2' },
  { name: 'FIA Cybercrime Wing', type: 'Law Enforcement', dist: '4.7 km', address: 'Garden Town, Lahore', phone: '051-9106384', open: true, color: '#4F46E5', bg: '#EEF2FF' },
  { name: 'Dastak Shelter Home', type: 'Shelter', dist: '5.2 km', address: 'Gulberg III, Lahore', phone: '042-35714090', open: false, color: '#EC4899', bg: '#FDF2F8' },
  { name: 'Women Protection Bureau', type: 'Government', dist: '6.8 km', address: 'Davis Road, Lahore', phone: '042-99200888', open: true, color: '#7C3AED', bg: '#F5F3FF' },
  { name: 'Edhi Foundation', type: 'NGO', dist: '7.2 km', address: 'Multan Road, Lahore', phone: '115', open: true, color: '#16A34A', bg: '#F0FDF4' },
]

export default function NearbyHelpScreen({ goBack }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white">
        <StatusBar />
        <div className="px-5 pt-2 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Nearby Help</h1>
              <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Lahore, Punjab · 6 places nearby</p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Shelters', 'Hospitals', 'Police', 'NGOs', 'Government'].map((filter, i) => (
              <button
                key={filter}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl"
                style={{
                  background: i === 0 ? '#4F46E5' : '#F3F4F6',
                  fontSize: 12,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? 'white' : '#6B7280',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="relative overflow-hidden" style={{ height: 140 }}>
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)' }}>
            {/* Simulated map grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
            {/* Location markers */}
            {[
              { x: '35%', y: '40%', active: true },
              { x: '55%', y: '60%' },
              { x: '70%', y: '30%' },
              { x: '25%', y: '65%' },
            ].map((marker, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  left: marker.x,
                  top: marker.y,
                  width: marker.active ? 28 : 22,
                  height: marker.active ? 28 : 22,
                  background: marker.active ? '#4F46E5' : '#EC4899',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: marker.active ? '0 0 0 6px rgba(79,70,229,0.2)' : 'none',
                }}
              >
                <MapPin size={marker.active ? 14 : 11} color="white" strokeWidth={2} />
              </div>
            ))}
            {/* You are here */}
            <div
              className="absolute flex items-center justify-center rounded-full bg-white shadow-lg"
              style={{ left: '50%', top: '50%', width: 20, height: 20, transform: 'translate(-50%, -50%)', border: '3px solid #4F46E5' }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          {places.map((place) => (
            <div key={place.name} className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: place.bg }}>
                  <MapPin size={20} color={place.color} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#111827]" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.3 }}>{place.name}</p>
                      <p className="text-[#9CA3AF] mt-0.5" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{place.address}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <div className={`px-2 py-0.5 rounded-full ${place.open ? 'bg-[#F0FDF4]' : 'bg-[#F3F4F6]'}`}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: place.open ? '#16A34A' : '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                          {place.open ? '24/7' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Navigation size={10} color="#9CA3AF" />
                      <span className="text-[#9CA3AF]" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{place.dist}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="px-1.5 py-0.5 rounded-md" style={{ background: place.bg }}>
                        <span style={{ fontSize: 10, color: place.color, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{place.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#EEF2FF] active:scale-95 transition-all">
                  <Phone size={13} color="#4F46E5" strokeWidth={2} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>{place.phone}</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F4F6] active:scale-95 transition-all">
                  <Navigation size={13} color="#374151" strokeWidth={2} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Directions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}
