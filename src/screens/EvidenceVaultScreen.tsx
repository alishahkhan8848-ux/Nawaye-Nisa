import { useEffect, useState } from 'react'
import { Plus, Shield, Image, Video, FileText, Music, Search, Lock, Grid3X3, List, Clock, Trash2, Loader2, FolderOpen, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import { useAuth } from '../contexts/AuthContext'
import { subscribeToEvidence, deleteEvidence, formatBytes, type EvidenceItem, type EvidenceType } from '../firebase/evidence'

const FILTERS = ['All', 'Images', 'Videos', 'Audio', 'Documents']

const ICON_BY_TYPE: Record<EvidenceType, { icon: any; color: string; bg: string }> = {
  image: { icon: Image, color: '#4F46E5', bg: '#EEF2FF' },
  video: { icon: Video, color: '#7C3AED', bg: '#F5F3FF' },
  audio: { icon: Music, color: '#EC4899', bg: '#FDF2F8' },
  document: { icon: FileText, color: '#16A34A', bg: '#F0FDF4' },
}

function formatDate(createdAt: unknown): string {
  const ts = createdAt as { toDate?: () => Date } | null
  const date = ts?.toDate ? ts.toDate() : null
  if (!date) return 'Just now'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fullDate(createdAt: unknown): string {
  const ts = createdAt as { toDate?: () => Date } | null
  const date = ts?.toDate ? ts.toDate() : new Date()
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function EvidenceVaultScreen({ navigate }: NavProps) {
  const { user } = useAuth()
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    const unsubscribe = subscribeToEvidence(
      user.uid,
      (list) => {
        setItems(list)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [user])

  const filtered = items.filter((item) => {
    const matchFilter =
      activeFilter === 'All' ? true :
      activeFilter === 'Images' ? item.type === 'image' :
      activeFilter === 'Videos' ? item.type === 'video' :
      activeFilter === 'Audio' ? item.type === 'audio' :
      item.type === 'document'
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.tag.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalSizeBytes = items.reduce((sum, item) => sum + item.sizeBytes, 0)
  const counts = {
    image: items.filter((e) => e.type === 'image').length,
    video: items.filter((e) => e.type === 'video').length,
    audio: items.filter((e) => e.type === 'audio').length,
    document: items.filter((e) => e.type === 'document').length,
  }

  async function handleDelete(item: EvidenceItem) {
    if (!window.confirm(`Delete "${item.name}"? This can't be undone.`)) return
    setDeletingId(item.id)
    try {
      await deleteEvidence(item)
    } catch {
      window.alert('Could not delete this file. Check your connection and try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const timelineDates = Array.from(new Set(filtered.map((i) => formatDate(i.createdAt))))

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#F3F4F6]">
        <StatusBar />
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>Evidence Vault</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF2FF]">
                  <Lock size={10} color="#4F46E5" strokeWidth={2.5} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>AES-256</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 1 }}>{items.length} files · {formatBytes(totalSizeBytes)} encrypted</p>
            </div>
            <button
              onClick={() => navigate('upload-evidence')}
              className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center"
            >
              <Plus size={18} color="white" strokeWidth={2.5} />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Images', count: counts.image, icon: Image, color: '#4F46E5', bg: '#EEF2FF' },
              { label: 'Videos', count: counts.video, icon: Video, color: '#7C3AED', bg: '#F5F3FF' },
              { label: 'Audio', count: counts.audio, icon: Music, color: '#EC4899', bg: '#FDF2F8' },
              { label: 'Docs', count: counts.document, icon: FileText, color: '#16A34A', bg: '#F0FDF4' },
            ].map((stat) => (
              <button key={stat.label} onClick={() => setActiveFilter(stat.label === 'Docs' ? 'Documents' : stat.label + 'es')} className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all" style={{ background: stat.bg }}>
                <stat.icon size={16} color={stat.color} strokeWidth={1.8} />
                <span style={{ fontSize: 14, fontWeight: 800, color: stat.color, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1 }}>{stat.count}</span>
                <span style={{ fontSize: 9, color: stat.color, fontFamily: 'Inter, -apple-system, sans-serif', opacity: 0.75 }}>{stat.label}</span>
              </button>
            ))}
          </div>

          {/* Search + view toggle */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 bg-[#FAFAFA]" style={{ height: 40 }}>
              <Search size={15} color="#9CA3AF" strokeWidth={1.8} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search evidence..."
                className="flex-1 bg-transparent outline-none text-[#111827]"
                style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}
              />
            </div>
            <div className="flex gap-1 p-1 rounded-xl bg-[#F3F4F6]">
              {[
                { id: 'list', icon: List },
                { id: 'grid', icon: Grid3X3 },
                { id: 'timeline', icon: Clock },
              ].map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id as any)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: viewMode === id ? 'white' : 'transparent', boxShadow: viewMode === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  <Icon size={15} color={viewMode === id ? '#4F46E5' : '#9CA3AF'} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-xl transition-all"
              style={{ background: activeFilter === f ? '#4F46E5' : '#F3F4F6', fontSize: 12, fontWeight: activeFilter === f ? 700 : 500, color: activeFilter === f ? 'white' : '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              {f} {activeFilter === f && f !== 'All' && <span style={{ opacity: 0.7 }}>({filtered.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-3">
              <AlertCircle size={26} color="#DC2626" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Couldn't load evidence</p>
            <p className="mt-1" style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{error}</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={28} color="#4F46E5" className="animate-spin mb-3" />
            <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>Loading your evidence...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
              <FolderOpen size={26} color="#9CA3AF" strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>
              {items.length === 0 ? 'No evidence yet' : 'No matches found'}
            </p>
            <p className="mt-1" style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>
              {items.length === 0 ? 'Upload photos, videos, audio, or documents to get started.' : 'Try a different search or filter.'}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <div className="px-4 py-4 flex flex-col gap-2.5">
                {filtered.map((item) => {
                  const meta = ICON_BY_TYPE[item.type]
                  return (
                    <a
                      key={item.id}
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm"
                      style={{ border: '1px solid #F3F4F6' }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                        <meta.icon size={20} color={meta.color} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{formatBytes(item.sizeBytes)}</span>
                          <span style={{ fontSize: 11, color: '#D1D5DB' }}>·</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="px-2 py-0.5 rounded-lg bg-[#F3F4F6]">
                          <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500 }}>{item.tag}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleDelete(item) }}
                          disabled={deletingId === item.id}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={14} color="#9CA3AF" className="animate-spin" />
                          ) : (
                            <Trash2 size={14} color="#DC2626" strokeWidth={1.8} />
                          )}
                        </button>
                      </div>
                    </a>
                  )
                })}
                <div className="h-2" />
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="px-4 py-4">
                <div className="grid grid-cols-3 gap-2.5">
                  {filtered.map((item) => {
                    const meta = ICON_BY_TYPE[item.type]
                    return (
                      <a
                        key={item.id}
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl overflow-hidden shadow-sm aspect-square flex flex-col"
                        style={{ background: meta.bg, border: '1px solid #F3F4F6' }}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          {item.type === 'image' ? (
                            <img src={item.downloadUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <meta.icon size={28} color={meta.color} strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="bg-white px-2 py-1.5">
                          <p className="truncate" style={{ fontSize: 10, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.name.split('.')[0]}</p>
                          <p style={{ fontSize: 9, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{formatBytes(item.sizeBytes)}</p>
                        </div>
                      </a>
                    )
                  })}
                </div>
                <div className="h-4" />
              </div>
            )}

            {viewMode === 'timeline' && (
              <div className="px-4 py-4">
                {timelineDates.map((date) => {
                  const dayItems = filtered.filter((i) => formatDate(i.createdAt) === date)
                  if (!dayItems.length) return null
                  return (
                    <div key={date} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.03em' }}>{fullDate(dayItems[0].createdAt)}</p>
                        <div className="flex-1 h-px bg-[#E5E7EB]" />
                      </div>
                      {dayItems.map((item) => {
                        const meta = ICON_BY_TYPE[item.type]
                        return (
                          <a
                            key={item.id}
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 ml-4 mb-2 bg-white rounded-xl px-3 py-3 shadow-sm"
                            style={{ border: '1px solid #F3F4F6' }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                              <meta.icon size={15} color={meta.color} strokeWidth={1.8} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate" style={{ fontSize: 12, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.name}</p>
                              <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{formatBytes(item.sizeBytes)} · {item.tag}</p>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  )
                })}
                <div className="h-4" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="px-4 py-4 border-t border-[#F3F4F6] bg-white">
        <button
          onClick={() => navigate('upload-evidence')}
          className="w-full rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ height: 52, background: 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 15, fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 600 }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Evidence
        </button>
      </div>
    </div>
  )
}
