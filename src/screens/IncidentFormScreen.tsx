import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Mic, Upload, MapPin, Phone, Shield, Loader2, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import PakistanLocationSelect from '../components/PakistanLocationSelect'
import { useAuth } from '../contexts/AuthContext'
import { createReport, updateReport, type ReportInput, type RiskLevel } from '../firebase/reports'
import { getUnlinkedEvidence, linkEvidenceToReport } from '../firebase/evidence'
import { isValidPakistaniPhone } from '../lib/phone'

const steps = ['Category', 'Location', 'Details', 'Evidence', 'Review']

const INCIDENT_CATEGORIES = [
  { label: 'Sexual Harassment', severity: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Domestic Violence', severity: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Physical Assault', severity: 'High', color: '#EA580C', bg: '#FFF7ED' },
  { label: 'Cyberstalking', severity: 'High', color: '#D97706', bg: '#FEF3C7' },
  { label: 'Cyber Blackmail', severity: 'High', color: '#D97706', bg: '#FEF3C7' },
  { label: 'Stalking', severity: 'Medium', color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Forced Marriage', severity: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Workplace Harassment', severity: 'Medium', color: '#D97706', bg: '#FEF3C7' },
  { label: 'Child Abuse', severity: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Human Trafficking', severity: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Other', severity: 'Low', color: '#6B7280', bg: '#F3F4F6' },
]

const RELATIONSHIP_OPTIONS = [
  'Husband / Partner', 'Ex-Husband / Ex-Partner', 'Father', 'Brother', 'Father-in-law',
  'Brother-in-law', 'Employer / Manager', 'Colleague / Coworker', 'Neighbor',
  'Teacher / Professor', 'Landlord', 'Stranger / Unknown', 'Other Relative', 'Other',
]

const RISK_LEVELS: { id: RiskLevel; label: string; desc: string; color: string; bg: string }[] = [
  { id: 'immediate', label: 'Immediate Danger', desc: 'In danger right now', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'high', label: 'High Risk', desc: 'Ongoing threat', color: '#EA580C', bg: '#FFF7ED' },
  { id: 'medium', label: 'Moderate Risk', desc: 'Recurring incidents', color: '#D97706', bg: '#FEF3C7' },
  { id: 'low', label: 'Low Risk', desc: 'Past incident', color: '#16A34A', bg: '#F0FDF4' },
]

function SelectField({ label, value, onChange, options, placeholder, required }: any) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-2xl border px-4 text-left"
        style={{ height: 50, background: open ? '#FAFBFF' : '#FAFAFA', borderColor: open ? '#4F46E5' : '#E5E7EB', borderWidth: open ? 1.5 : 1 }}
      >
        <span style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', color: value ? '#111827' : '#9CA3AF', fontWeight: value ? 500 : 400 }}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} color={open ? '#4F46E5' : '#9CA3AF'} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-50 rounded-2xl shadow-xl overflow-hidden" style={{ top: 'calc(100% + 4px)', background: 'white', border: '1.5px solid #E5E7EB', maxHeight: 200, overflowY: 'auto' }}>
          {options.map((opt: string) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-4 py-3 hover:bg-[#F8F9FF]"
              style={{ fontSize: 14, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', borderBottom: '1px solid #F9FAFB', fontWeight: value === opt ? 600 : 400 }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const today = new Date().toISOString().split('T')[0]

export default function IncidentFormScreen({ navigate, goBack }: NavProps) {
  const { user, isOnline } = useAuth()
  const [step, setStep] = useState(0)
  const sessionStartedAt = useRef(Date.now())

  const [category, setCategory] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [tehsil, setTehsil] = useState('')
  const [address, setAddress] = useState('')
  const [policeStation, setPoliceStation] = useState('')
  const [hospital, setHospital] = useState('')
  const [protectionCenter, setProtectionCenter] = useState('')
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [riskLevel, setRiskLevel] = useState<RiskLevel | ''>('')
  const [relationship, setRelationship] = useState('')
  const [witness, setWitness] = useState<null | boolean>(null)
  const [witnessContact, setWitnessContact] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [description, setDescription] = useState('')
  const [consent, setConsent] = useState(false)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState<{ referenceId: string } | null>(null)

  const canNext = () => {
    if (step === 0) return !!category
    if (step === 1) return !!province && !!district && !!tehsil
    if (step === 2) return !!riskLevel && !!date && description.trim().length > 0
    return true
  }

  const nextStep = () => { if (canNext()) setStep((s) => Math.min(s + 1, steps.length - 1)) }
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  function buildInput(): ReportInput {
    return {
      category, province, district, tehsil, address, policeStation, hospital, protectionCenter,
      date, time, riskLevel, relationship, witnessAvailable: witness, witnessContact, emergencyContact, description,
    }
  }

  /**
   * Evidence is uploaded to the vault mid-form, before the report document
   * exists (it's only created here, on submit/draft-save). This links any
   * evidence the user uploaded during *this* form session — and not yet
   * attached to any other report — onto the newly created report, and copies
   * its download URLs onto the report's evidenceUrls field. Runs best-effort:
   * if it fails, the report itself has already been saved successfully, so
   * we don't want to surface this as a submit failure.
   */
  async function attachSessionEvidence(reportId: string, uid: string) {
    try {
      const unlinked = await getUnlinkedEvidence(uid)
      const sessionItems = unlinked.filter((item) => {
        const createdMs = (item.createdAt as { toMillis?: () => number } | null)?.toMillis?.()
        return typeof createdMs === 'number' && createdMs >= sessionStartedAt.current
      })
      if (sessionItems.length === 0) return
      await linkEvidenceToReport(sessionItems.map((item) => item.id), reportId)
      await updateReport(reportId, { evidenceUrls: sessionItems.map((item) => item.downloadUrl) })
    } catch {
      // Non-fatal: the report was already saved. The person can still attach evidence manually from the vault.
    }
  }

  async function handleSubmit() {
    setSubmitError('')
    if (!consent) {
      setFieldErrors({ consent: 'Please confirm the statement above to submit.' })
      return
    }
    if (!user) {
      setSubmitError('You need to be signed in to submit a report.')
      return
    }
    if (!isOnline) {
      setSubmitError('You appear to be offline. Connect to the internet and try again.')
      return
    }
    setSubmitting(true)
    try {
      const created = await createReport(user.uid, buildInput(), 'submitted')
      await attachSessionEvidence(created.id, user.uid)
      setResult({ referenceId: created.referenceId })
      navigate('ai-assistant')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit your report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveDraft() {
    setSubmitError('')
    if (!user) {
      setSubmitError('You need to be signed in to save a draft.')
      return
    }
    if (!isOnline) {
      setSubmitError('You appear to be offline. Connect to the internet and try again.')
      return
    }
    setSavingDraft(true)
    try {
      const created = await createReport(user.uid, buildInput(), 'draft')
      await attachSessionEvidence(created.id, user.uid)
      setResult({ referenceId: created.referenceId })
      window.alert(`Draft saved. Reference: ${created.referenceId}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not save your draft. Please try again.')
    } finally {
      setSavingDraft(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-3 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={step === 0 ? goBack : prevStep} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-[#111827]" style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                {steps[step]}
              </h1>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{step + 1} / {steps.length}</span>
            </div>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= step ? '#4F46E5' : '#E5E7EB' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step labels */}
      <div className="flex items-center px-5 pb-3 border-b border-[#F3F4F6]">
        <div className="flex gap-0 overflow-x-auto no-scrollbar -mx-1 px-1">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1 px-2" style={{ opacity: i === step ? 1 : 0.4 }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: i <= step ? '#4F46E5' : '#E5E7EB' }}>
                {i < step ? (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L2.8 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 9, fontWeight: 800, color: i === step ? 'white' : '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, color: i === step ? '#4F46E5' : '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif', whiteSpace: 'nowrap' }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {submitError && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex gap-2 items-start" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <AlertCircle size={16} color="#DC2626" className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: 13, color: '#991B1B', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{submitError}</p>
          </div>
        )}

        {/* STEP 0: Category */}
        {step === 0 && (
          <div>
            <p className="text-[#6B7280] mb-4" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
              Select the category that best describes your situation. This determines the applicable laws and resources.
            </p>
            <div className="flex flex-col gap-2">
              {INCIDENT_CATEGORIES.map((cat) => {
                const isSelected = category === cat.label
                return (
                  <button
                    key={cat.label}
                    onClick={() => setCategory(cat.label)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-left"
                    style={{ background: isSelected ? cat.bg : '#FAFAFA', borderColor: isSelected ? cat.color : '#E5E7EB' }}
                  >
                    <div className="flex-1">
                      <p style={{ fontSize: 14, fontWeight: isSelected ? 700 : 500, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{cat.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-full" style={{ background: cat.bg, border: `1px solid ${cat.color}30` }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, fontFamily: 'Inter, -apple-system, sans-serif' }}>{cat.severity}</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isSelected ? cat.color : '#D1D5DB', background: isSelected ? cat.color : 'transparent' }}>
                        {isSelected && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L2.8 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Location */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#EEF2FF] rounded-2xl px-4 py-3 flex gap-2.5 items-start">
              <MapPin size={16} color="#4F46E5" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
                Location helps determine the correct jurisdiction and relevant legal resources. All location data is encrypted.
              </p>
            </div>

            <PakistanLocationSelect
              value={{ province, district, tehsil }}
              onChange={(location) => {
                setProvince(location.province)
                setDistrict(location.district)
                setTehsil(location.tehsil)
              }}
            />

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Exact Address / Landmark
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. DHA Phase 5, Main Boulevard, near McDonald's"
                className="w-full rounded-2xl border px-4 outline-none text-[#111827] bg-[#FAFAFA]"
                style={{ height: 50, fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  Nearest Police Station
                </label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  placeholder="e.g. Model Town PS"
                  className="w-full rounded-2xl border px-3 outline-none text-[#111827] bg-[#FAFAFA]"
                  style={{ height: 50, fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB' }}
                />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  Nearest Hospital
                </label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. Lahore General"
                  className="w-full rounded-2xl border px-3 outline-none text-[#111827] bg-[#FAFAFA]"
                  style={{ height: 50, fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB' }}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Women's Protection Center (if known)
              </label>
              <input
                type="text"
                value={protectionCenter}
                onChange={(e) => setProtectionCenter(e.target.value)}
                placeholder="e.g. Dar-ul-Aman, Hall Road"
                className="w-full rounded-2xl border px-4 outline-none text-[#111827] bg-[#FAFAFA]"
                style={{ height: 50, fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Incident Details */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  Date <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="flex items-center rounded-2xl border px-3 bg-[#FAFAFA]" style={{ height: 50, borderColor: '#E5E7EB' }}>
                  <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-transparent outline-none text-[#111827]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  Approximate Time
                </label>
                <div className="flex items-center rounded-2xl border px-3 bg-[#FAFAFA]" style={{ height: 50, borderColor: '#E5E7EB' }}>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1 bg-transparent outline-none text-[#111827]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }} />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Current Risk Level <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RISK_LEVELS.map((level) => {
                  const isSelected = riskLevel === level.id
                  return (
                    <button
                      key={level.id}
                      onClick={() => setRiskLevel(level.id)}
                      className="flex flex-col items-start px-3.5 py-3 rounded-2xl border-2 text-left transition-all"
                      style={{ background: isSelected ? level.bg : '#FAFAFA', borderColor: isSelected ? level.color : '#E5E7EB' }}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <p style={{ fontSize: 12, fontWeight: 700, color: isSelected ? level.color : '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>{level.label}</p>
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: isSelected ? level.color : '#D1D5DB', background: isSelected ? level.color : 'transparent' }}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>{level.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <SelectField
              label="Relationship with Accused"
              value={relationship}
              onChange={setRelationship}
              options={RELATIONSHIP_OPTIONS}
              placeholder="Select relationship"
              required
            />

            <div>
              <label className="block mb-2" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Witness Available?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: true, label: 'Yes, witness(es) available' },
                  { val: false, label: 'No witness available' },
                ].map((opt) => (
                  <button
                    key={String(opt.val)}
                    onClick={() => setWitness(opt.val)}
                    className="px-3 py-3 rounded-2xl border-2 text-left transition-all"
                    style={{ background: witness === opt.val ? '#EEF2FF' : '#FAFAFA', borderColor: witness === opt.val ? '#4F46E5' : '#E5E7EB' }}
                  >
                    <p style={{ fontSize: 12, fontWeight: witness === opt.val ? 700 : 400, color: witness === opt.val ? '#4F46E5' : '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.4 }}>
                      {opt.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {witness && (
              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Witness Name & Contact</label>
                <input
                  type="text"
                  value={witnessContact}
                  onChange={(e) => setWitnessContact(e.target.value)}
                  placeholder="Full name · +92 3XX XXXXXXX"
                  className="w-full rounded-2xl border px-4 outline-none text-[#111827] bg-[#FAFAFA]"
                  style={{ height: 50, fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB' }}
                />
              </div>
            )}

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Emergency Contact for this Case
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4 bg-[#FAFAFA]" style={{ height: 50, borderColor: emergencyContact && !isValidPakistaniPhone(emergencyContact) ? '#FCA5A5' : '#E5E7EB' }}>
                <Phone size={15} color="#9CA3AF" strokeWidth={1.8} />
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="3XX XXXXXXX"
                  className="flex-1 bg-transparent outline-none text-[#111827]"
                  style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif' }}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Incident Description <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                placeholder="Describe what happened in your own words. Include as many details as you feel comfortable sharing. All information is encrypted and private..."
                className="w-full rounded-2xl border px-4 py-3.5 outline-none text-[#111827] bg-[#FAFAFA] resize-none"
                style={{ minHeight: 120, fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', borderColor: '#E5E7EB', lineHeight: 1.65 }}
              />
              <p className="text-right text-[#9CA3AF] mt-1" style={{ fontSize: 11, fontFamily: 'Inter, -apple-system, sans-serif' }}>{description.length} / 2000</p>
            </div>

            {/* Voice recording - disabled until real audio capture ships (separate phase) */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>
                Voice Statement <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(Coming soon)</span>
              </label>
              <div
                title="Voice recording is coming in a future update"
                className="w-full flex items-center gap-4 rounded-2xl border px-4"
                style={{ height: 58, background: '#FAFAFA', borderColor: '#E5E7EB', opacity: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                  <Mic size={18} color="#4F46E5" strokeWidth={1.8} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}>Voice recording coming soon</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>You can still describe the incident in writing above</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Evidence */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#EEF2FF] rounded-2xl px-4 py-3.5">
              <p className="text-[#4F46E5]" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Evidence Checklist</p>
              <p className="text-[#374151] mt-1" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
                Upload evidence from your Evidence Vault. The more evidence you provide, the stronger your case.
              </p>
            </div>

            {[
              { type: 'Photos / Screenshots', desc: 'Messages, threats, images', icon: '🖼' },
              { type: 'Video Recordings', desc: 'CCTV, phone recordings', icon: '🎥' },
              { type: 'Audio Recordings', desc: 'Voice messages, calls', icon: '🎵' },
              { type: 'Medical Reports', desc: 'Doctor certificates, injury photos', icon: '🏥' },
              { type: 'Documents', desc: 'FIR copy, legal notices, letters', icon: '📄' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => navigate('upload-evidence')}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl border bg-white transition-all active:scale-[0.98] text-left w-full"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: '#F3F4F6' }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.type}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{item.desc}</p>
                </div>
                <div className="flex items-center justify-center rounded-xl border px-3 py-1.5" style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}>
                  <Upload size={14} color="#6B7280" strokeWidth={1.8} />
                </div>
              </button>
            ))}

            <p className="text-center text-[#9CA3AF]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>
              Evidence is optional — you can add more later from the Evidence Vault
            </p>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#F0FDF4] rounded-2xl px-4 py-4 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                <Shield size={16} color="#16A34A" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#166534', fontFamily: 'Inter, -apple-system, sans-serif' }}>Ready to Submit</p>
                <p style={{ fontSize: 12, color: '#166534', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5, marginTop: 2 }}>
                  Your report will be encrypted and saved securely. You control who sees it.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
              <div className="px-4 py-3 border-b border-[#F3F4F6]">
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif' }}>Case Summary</p>
              </div>
              {[
                { label: 'Category', value: category || 'Not selected' },
                { label: 'Risk Level', value: RISK_LEVELS.find((r) => r.id === riskLevel)?.label || 'Not selected' },
                { label: 'Date', value: date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set' },
                { label: 'Location', value: [tehsil, district, province].filter(Boolean).join(', ') || 'Not set' },
                { label: 'Relationship', value: relationship || 'Not selected' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6] last:border-0">
                  <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'Inter, -apple-system, sans-serif', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {result && (
              <div className="bg-[#EEF2FF] rounded-2xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }}>Case Reference ID</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '0.02em' }}>{result.referenceId}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(result.referenceId)}
                  style={{ fontSize: 13, fontWeight: 600, color: '#4F46E5', fontFamily: 'Inter, -apple-system, sans-serif' }}
                >
                  Copy
                </button>
              </div>
            )}

            <button type="button" onClick={() => setConsent(!consent)} className="flex items-start gap-3 text-left">
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ borderColor: '#4F46E5', background: consent ? '#4F46E5' : 'transparent' }}
              >
                {consent && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L2.8 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>
                I confirm this information is accurate to the best of my knowledge and I consent to this report being stored securely.
              </p>
            </button>
            {fieldErrors.consent && (
              <p style={{ fontSize: 12, color: '#DC2626', fontFamily: 'Inter, -apple-system, sans-serif', marginTop: -8 }}>{fieldErrors.consent}</p>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* Bottom CTA */}
      <div className="px-5 py-4 border-t border-[#F3F4F6] bg-white">
        {step < steps.length - 1 ? (
          <div className="flex gap-3">
            {step > 0 && (
              <button
                className="flex items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
                style={{ width: 52, height: 52 }}
                onClick={prevStep}
              >
                <ChevronLeft size={20} color="#374151" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex-1 rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                height: 52,
                background: canNext() ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : '#E5E7EB',
                fontSize: 15,
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontWeight: 600,
                color: canNext() ? 'white' : '#9CA3AF',
              }}
            >
              Continue
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft || submitting}
              className="px-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] text-[#374151] flex items-center justify-center gap-2"
              style={{ height: 52, fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif', opacity: savingDraft ? 0.6 : 1 }}
            >
              {savingDraft ? <Loader2 size={16} className="animate-spin" /> : null}
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || savingDraft}
              className="flex-1 rounded-2xl text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                height: 52,
                background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                fontSize: 15,
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontWeight: 600,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit & Analyze'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
