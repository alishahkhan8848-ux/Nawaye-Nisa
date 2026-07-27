import { useEffect, useState } from 'react'
import { Search, Plus, FileText, Download, ArrowUpDown, Loader2, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import { useAuth } from '../contexts/AuthContext'
import { getUserReports, type Report, type ReportStatus, type RiskLevel } from '../firebase/reports'

const STATUS_FILTERS = ['All', 'Draft', 'Submitted']

interface ReportRow {
  id: string
  referenceId: string
  title: string
  category: string
  date: string
  status: string
  statusColor: string
  statusBg: string
  evidence: number
  ai: boolean
  risk: string
  riskColor: string
  riskBg: string
}

function statusDisplay(status: ReportStatus): { label: string; color: string; bg: string } {
  if (status === 'submitted') return { label: 'Submitted', color: '#16A34A', bg: '#F0FDF4' }
  return { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' }
}

function riskDisplay(risk: RiskLevel | ''): { label: string; color: string; bg: string } {
  if (risk === 'immediate') return { label: 'Immediate', color: '#DC2626', bg: '#FEF2F2' }
  if (risk === 'high') return { label: 'High', color: '#DC2626', bg: '#FEF2F2' }
  if (risk === 'medium') return { label: 'Medium', color: '#D97706', bg: '#FEF3C7' }
  if (risk === 'low') return { label: 'Low', color: '#16A34A', bg: '#F0FDF4' }
  return { label: 'Unspecified', color: '#6B7280', bg: '#F3F4F6' }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return dateStr
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function toRow(report: Report): ReportRow {
  const status = statusDisplay(report.status)
  const risk = riskDisplay(report.riskLevel)
  return {
    id: report.id,
    referenceId: report.referenceId || report.id,
    title: report.category || 'Incident Report',
    category: report.district || report.province || 'Location not set',
    date: formatDate(report.date),
    status: status.label,
    statusColor: status.color,
    statusBg: status.bg,
    evidence: report.evidenceUrls?.length ?? 0,
    ai: Boolean(report.aiSummary),
    risk: risk.label,
    riskColor: risk.color,
    riskBg: risk.bg,
  }
}

export default function ReportHistoryScreen({ navigate }: NavProps) {
  const { user, isOnline } = useAuth()
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date')
  const [exportTarget, setExportTarget] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!user) {
        setReports([])
        setLoading(false)
        return
      }
      setLoading(true)
      setLoadError('')
      try {
        const docs = await getUserReports(user.uid)
        if (!cancelled) setReports(docs.map(toRow))
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load your reports.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user])

  const filtered = reports
    .filter((r) => {
      const matchFilter = filter === 'All' || r.status === filter
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.referenceId.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0 // already newest-first via getUserReports' orderBy('createdAt', 'desc')
    })

  const activeCount = reports.filter((r) => r.status === 'Submitted').length

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#F3F4F6]">
        <StatusBar />
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>My Reports</h1>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 1 }}>{reports.length} cases · {activeCount} active</p>
            </div>
            <button
              onClick={() => navigate('report-incident')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              <Plus size={15} strokeWidth={2.5} />
              New
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 bg-[#FAFAFA] mb-3" style={{ height: 42 }}>
            <Search size={15} color="#9CA3AF" strokeWidth={1.8} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or case ID..."
              className="flex-1 bg-transparent outline-none text-[#111827]"
              style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}
            />
          </div>

          {/* Filter + sort */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl transition-all"
                  style={{ background: filter === f ? '#4F46E5' : '#F3F4F6', fontSize: 12, fontWeight: filter === f ? 700 : 500, color: filter === f ? 'white' : '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'status' : 'date')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F3F4F6] flex-shrink-0 ml-2"
            >
              <ArrowUpDown size={12} color="#6B7280" strokeWidth={2} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>Sort</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!isOnline && (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3" style={{ background: '#FEF3C7' }}>
            <AlertCircle size={14} color="#D97706" strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E', fontFamily: 'Inter, -apple-system, sans-serif' }}>You're offline. Showing the last data loaded.</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={28} color="#4F46E5" strokeWidth={2} className="animate-spin" />
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 10 }}>Loading your reports...</p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-3">
              <AlertCircle size={26} color="#DC2626" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Couldn't load reports</p>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 4, maxWidth: 260 }}>{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-3">
              <FileText size={26} color="#4F46E5" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>No reports found</p>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 4 }}>
              {reports.length === 0 ? 'Reports you submit or save as drafts will appear here.' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                {/* Header row */}
                <button
                  onClick={() => navigate('timeline')}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left transition-all active:bg-[#FAFBFF]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <FileText size={18} color="#4F46E5" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.title}</p>
                      {report.ai && (
                        <div className="px-1.5 py-0.5 rounded-md bg-[#EEF2FF]">
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}>AI</span>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: 1 }}>{report.referenceId} · {report.date}</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: report.statusBg }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: report.statusColor, fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.status}</span>
                  </div>
                </button>

                {/* Metadata row */}
                <div className="flex items-center gap-2 px-4 pb-3">
                  <div className="px-2 py-0.5 rounded-md bg-[#F3F4F6]">
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.category}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.evidence} evidence items</span>
                  <div className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                  <div className="px-2 py-0.5 rounded-md" style={{ background: report.riskBg }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: report.riskColor, fontFamily: 'Inter, -apple-system, sans-serif' }}>{report.risk} Risk</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-0 border-t border-[#F3F4F6]">
                  {[
                    { label: 'Timeline', action: () => navigate('timeline'), bold: false },
                    { label: 'AI Analysis', action: () => navigate('ai-assistant'), bold: false },
                    { label: 'Complaint', action: () => navigate('complaint-preview'), bold: true },
                  ].map((btn, i) => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      className="flex-1 py-3 text-center transition-all active:bg-[#F8F9FF]"
                      style={{
                        fontSize: 12,
                        fontWeight: btn.bold ? 700 : 600,
                        color: btn.bold ? '#4F46E5' : '#6B7280',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        borderRight: i < 2 ? '1px solid #F3F4F6' : 'none',
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setExportTarget(report.referenceId)}
                    className="px-4 py-3 border-l border-[#F3F4F6] transition-all active:bg-[#FEF2F2]"
                  >
                    <Download size={14} color="#6B7280" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export confirmation */}
        {exportTarget && (
          <div
            className="fixed inset-0 flex items-end justify-center pb-8 px-4 z-50"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setExportTarget(null)}
          >
            <div
              className="bg-white rounded-3xl px-5 py-5 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF2F2] flex items-center justify-center">
                  <Download size={18} color="#DC2626" strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Export Report</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{exportTarget}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6, marginBottom: 16 }}>
                Export this report as a PDF document including all evidence and AI analysis?
              </p>
              <div className="flex gap-2">
                <button onClick={() => setExportTarget(null)} className="flex-1 py-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]" style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Cancel</button>
                <button onClick={() => setExportTarget(null)} className="flex-1 py-3 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Export PDF</button>
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
