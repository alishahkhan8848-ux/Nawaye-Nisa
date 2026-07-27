import { useRef, useState } from 'react'
import { ChevronLeft, Upload, Image, Video, FileText, Music, Camera, Check, AlertCircle } from 'lucide-react'
import type { NavProps } from '../types'
import StatusBar from '../components/StatusBar'
import { useAuth } from '../contexts/AuthContext'
import { uploadEvidence, acceptAttributeFor, EvidenceUploadError, type EvidenceType } from '../firebase/evidence'

type UiState = 'idle' | 'uploading' | 'uploaded' | 'error'

export default function UploadEvidenceScreen({ navigate, goBack }: NavProps) {
  const { user, isOnline } = useAuth()
  const [state, setState] = useState<UiState>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastFileName, setLastFileName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const pendingTypeRef = useRef<EvidenceType>('image')

  const types: { id: EvidenceType | 'camera'; icon: any; label: string; color: string; bg: string; ext: string }[] = [
    { id: 'image', icon: Image, label: 'Photo / Screenshot', color: '#4F46E5', bg: '#EEF2FF', ext: 'JPG, PNG, HEIC' },
    { id: 'video', icon: Video, label: 'Video Recording', color: '#7C3AED', bg: '#F5F3FF', ext: 'MP4, MOV, AVI' },
    { id: 'audio', icon: Music, label: 'Audio Recording', color: '#EC4899', bg: '#FDF2F8', ext: 'M4A, MP3, WAV' },
    { id: 'document', icon: FileText, label: 'Document / PDF', color: '#16A34A', bg: '#F0FDF4', ext: 'PDF, DOC, DOCX' },
    { id: 'camera', icon: Camera, label: 'Take Photo Now', color: '#D97706', bg: '#FEF3C7', ext: 'Capture directly' },
  ]

  function triggerPicker(typeId: EvidenceType | 'camera') {
    setErrorMessage('')
    if (typeId === 'camera') {
      pendingTypeRef.current = 'image'
      cameraInputRef.current?.click()
      return
    }
    pendingTypeRef.current = typeId
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptAttributeFor(typeId)
      fileInputRef.current.click()
    }
  }

  async function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    if (!user) {
      setErrorMessage('You need to be signed in to upload evidence.')
      setState('error')
      return
    }
    if (!isOnline) {
      setErrorMessage('You appear to be offline. Connect to the internet and try again.')
      setState('error')
      return
    }

    setLastFileName(file.name)
    setState('uploading')
    setProgress(0)
    try {
      await uploadEvidence({
        uid: user.uid,
        file,
        type: pendingTypeRef.current,
        tag: 'Evidence',
        onProgress: setProgress,
      })
      setState('uploaded')
    } catch (err) {
      setErrorMessage(
        err instanceof EvidenceUploadError
          ? err.message
          : 'Upload failed. Check your connection and try again.'
      )
      setState('error')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      {/* Hidden real file inputs - one for the type picker, one dedicated to camera capture */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChosen} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChosen} />

      <div className="px-5 pt-3 pb-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#F9FAFB] flex items-center justify-center">
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[#111827]" style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Upload Evidence</h1>
            <p className="text-[#6B7280]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>Encrypted storage, only visible to you</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {state === 'uploaded' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
              <Check size={40} color="#16A34A" strokeWidth={2.5} />
            </div>
            <h2 className="text-[#111827] mb-2" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Inter, -apple-system, sans-serif' }}>Evidence Secured</h2>
            <p className="text-[#6B7280]" style={{ fontSize: 14, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
              "{lastFileName}" has been uploaded and securely stored in your Evidence Vault.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setState('idle')}
                className="px-5 py-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
                style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                Add More
              </button>
              <button
                onClick={() => navigate('evidence-vault')}
                className="px-5 py-3 rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                View Vault
              </button>
            </div>
          </div>
        ) : state === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-4 relative">
              <Upload size={32} color="#4F46E5" strokeWidth={1.8} />
              <div
                className="absolute inset-0 rounded-full border-4 border-[#4F46E5] border-t-transparent animate-spin"
                style={{ borderTopColor: 'transparent' }}
              />
            </div>
            <h2 className="text-[#111827] mb-2" style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Uploading...</h2>
            <p className="text-[#6B7280]" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}>{lastFileName}</p>
            <div className="w-48 h-1.5 bg-[#E5E7EB] rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#4F46E5] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2" style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, -apple-system, sans-serif' }}>{progress}%</p>
          </div>
        ) : (
          <>
            {state === 'error' && (
              <div className="mb-4 rounded-2xl px-4 py-3 flex gap-2 items-start" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                <AlertCircle size={16} color="#DC2626" className="flex-shrink-0 mt-0.5" />
                <p style={{ fontSize: 13, color: '#991B1B', fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.5 }}>{errorMessage}</p>
              </div>
            )}

            {/* Drag area */}
            <div
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-8 mb-5 transition-all"
              style={{ borderColor: '#C7D2FE', background: '#F8F9FF' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-3">
                <Upload size={28} color="#4F46E5" strokeWidth={1.5} />
              </div>
              <p className="text-[#111827]" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Upload Files</p>
              <p className="text-[#9CA3AF] mt-1" style={{ fontSize: 13, fontFamily: 'Inter, -apple-system, sans-serif' }}>choose a type below</p>
            </div>

            {/* Type selection */}
            <p className="text-[#111827] mb-3" style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>Choose Evidence Type</p>
            <div className="flex flex-col gap-3">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => triggerPicker(type.id)}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-[#F3F4F6] bg-white transition-all active:scale-[0.98] text-left shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: type.bg }}>
                    <type.icon size={22} color={type.color} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#111827]" style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Inter, -apple-system, sans-serif' }}>{type.label}</p>
                    <p className="text-[#9CA3AF]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif' }}>{type.ext}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl border border-[#E5E7EB] flex items-center justify-center">
                    <Upload size={14} color="#9CA3AF" strokeWidth={1.8} />
                  </div>
                </button>
              ))}
            </div>

            {/* Privacy note */}
            <div className="mt-5 bg-[#F0FDF4] rounded-2xl px-4 py-3.5 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[#166534]" style={{ fontSize: 12, fontFamily: 'Inter, -apple-system, sans-serif', lineHeight: 1.6 }}>
                Files are encrypted at rest (AES-256) and access is restricted to your account only.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
