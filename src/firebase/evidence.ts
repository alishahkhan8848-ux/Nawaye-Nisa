import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot,
} from 'firebase/storage'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  getCountFromServer,
  writeBatch,
  serverTimestamp,
  type Unsubscribe,
  type Timestamp,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore'
import imageCompression from 'browser-image-compression'
import { storage, db } from './firebase'

export type EvidenceType = 'image' | 'video' | 'audio' | 'document'

export interface EvidenceItem {
  id: string
  uid: string
  type: EvidenceType
  name: string
  sizeBytes: number
  mimeType: string
  storagePath: string
  downloadUrl: string
  tag: string
  reportId: string | null
  createdAt: unknown
}

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100MB hard ceiling per file

const ACCEPT_BY_TYPE: Record<EvidenceType, string> = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  document: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export function acceptAttributeFor(type: EvidenceType): string {
  return ACCEPT_BY_TYPE[type]
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export class EvidenceUploadError extends Error {}
export class EvidenceServiceError extends Error {}

function friendlyEvidenceMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string } | null)?.code
  if (code === 'permission-denied' || code === 'storage/unauthorized') {
    return "You don't have permission to access that evidence."
  }
  if (code === 'unavailable' || code === 'storage/retry-limit-exceeded') {
    return 'Network issue reaching the server. Please check your connection and try again.'
  }
  return fallback
}

function validateFile(file: File, type: EvidenceType): void {
  if (file.size === 0) throw new EvidenceUploadError('That file is empty.')
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new EvidenceUploadError(`File is too large (${formatBytes(file.size)}). Maximum size is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`)
  }
  if (type === 'document') {
    const okExt = /\.(pdf|docx?|PDF|DOCX?)$/.test(file.name)
    const okMime = file.type === 'application/pdf' || file.type.includes('word') || file.type === ''
    if (!okExt && !okMime) throw new EvidenceUploadError('Please choose a PDF or Word document.')
  }
}

/** Compresses an image client-side before upload, to keep uploads fast on weak connections. Falls back to the original file if compression fails. */
async function maybeCompress(file: File, type: EvidenceType): Promise<File> {
  if (type !== 'image') return file
  try {
    return await imageCompression(file, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type || undefined,
    })
  } catch {
    // If compression fails for any reason (unsupported format, etc.), upload the original rather than blocking the person from submitting evidence.
    return file
  }
}

export interface UploadEvidenceOptions {
  uid: string
  file: File
  type: EvidenceType
  tag: string
  reportId?: string | null
  onProgress?: (percent: number) => void
}

/**
 * Uploads a single evidence file to Firebase Storage under the signed-in user's
 * private folder, then writes a Firestore metadata record once the upload
 * finishes. Access to both the storage path and the Firestore record is
 * restricted to the owning uid by the project's security rules.
 */
export async function uploadEvidence(opts: UploadEvidenceOptions): Promise<EvidenceItem> {
  const { uid, type, tag, reportId, onProgress } = opts
  validateFile(opts.file, type)
  const file = await maybeCompress(opts.file, type)

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `users/${uid}/evidence/${Date.now()}_${safeName}`
  const storageRef = ref(storage, storagePath)

  const downloadUrl = await new Promise<string>((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type || undefined })
    task.on(
      'state_changed',
      (snap: UploadTaskSnapshot) => {
        onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
      },
      (err) => reject(err),
      () => getDownloadURL(task.snapshot.ref).then(resolve).catch(reject)
    )
  })

  let docRef: DocumentReference<DocumentData>
  try {
    docRef = await addDoc(collection(db, 'evidence'), {
      uid,
      type,
      name: file.name,
      sizeBytes: file.size,
      mimeType: file.type || 'application/octet-stream',
      storagePath,
      downloadUrl,
      tag,
      reportId: reportId ?? null,
      createdAt: serverTimestamp(),
    })
  } catch {
    // The file already uploaded successfully but its metadata record failed to write — clean up
    // the orphaned file rather than leaving it permanently invisible and undeletable in Storage.
    await deleteObject(storageRef).catch(() => {
      // Best effort only; if this also fails there's nothing more we can safely do here.
    })
    throw new EvidenceUploadError('Could not save your evidence. Please try again.')
  }

  return {
    id: docRef.id,
    uid,
    type,
    name: file.name,
    sizeBytes: file.size,
    mimeType: file.type || 'application/octet-stream',
    storagePath,
    downloadUrl,
    tag,
    reportId: reportId ?? null,
    createdAt: null,
  }
}

/** Subscribes to real-time updates of the signed-in user's evidence, newest first. Pass `onError` to be notified if the listener itself fails (e.g. a permissions issue), since Firestore's onSnapshot fails silently otherwise. */
export function subscribeToEvidence(
  uid: string,
  callback: (items: EvidenceItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, 'evidence'), where('uid', '==', uid), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EvidenceItem, 'id'>) }))
      callback(items)
    },
    (err) => {
      onError?.(new EvidenceServiceError(friendlyEvidenceMessage(err, 'Could not keep your evidence list up to date.')))
    }
  )
}

export async function deleteEvidence(item: EvidenceItem): Promise<void> {
  try {
    await deleteObject(ref(storage, item.storagePath)).catch((err) => {
      // If the file's already gone from Storage, don't block deleting the metadata record.
      if (err?.code !== 'storage/object-not-found') throw err
    })
    await deleteDoc(doc(db, 'evidence', item.id))
  } catch (err) {
    throw new EvidenceServiceError(friendlyEvidenceMessage(err, 'Could not delete that evidence. Please try again.'))
  }
}

/** Returns how many evidence items the user has uploaded in total, without fetching every document (used for profile statistics). */
export async function getEvidenceCount(uid: string): Promise<number> {
  try {
    const q = query(collection(db, 'evidence'), where('uid', '==', uid))
    const snap = await getCountFromServer(q)
    return snap.data().count
  } catch (err) {
    throw new EvidenceServiceError(friendlyEvidenceMessage(err, 'Could not load your evidence count. Please try again.'))
  }
}

/**
 * Fetches the signed-in user's evidence that isn't yet attached to any
 * report (reportId === null), newest first. Used to find evidence uploaded
 * during an in-progress incident-report session so it can be linked once the
 * report itself is created (a report doesn't exist yet while the person is
 * still filling out the form).
 */
export async function getUnlinkedEvidence(uid: string): Promise<EvidenceItem[]> {
  try {
    const q = query(collection(db, 'evidence'), where('uid', '==', uid), where('reportId', '==', null))
    const snap = await getDocs(q)
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EvidenceItem, 'id'>) }))
    // Sort newest-first client-side to avoid requiring a 3-field composite index (uid + reportId + createdAt).
    return items.sort((a, b) => {
      const aMs = (a.createdAt as Timestamp | null)?.toMillis?.() ?? 0
      const bMs = (b.createdAt as Timestamp | null)?.toMillis?.() ?? 0
      return bMs - aMs
    })
  } catch (err) {
    throw new EvidenceServiceError(friendlyEvidenceMessage(err, 'Could not load your evidence. Please try again.'))
  }
}

/**
 * Attaches a set of evidence items to a report by writing `reportId` onto
 * each evidence document. Uses a batched write so the operation is atomic —
 * either all items get linked or none do.
 */
export async function linkEvidenceToReport(evidenceIds: string[], reportId: string): Promise<void> {
  if (evidenceIds.length === 0) return
  try {
    const batch = writeBatch(db)
    for (const id of evidenceIds) {
      batch.update(doc(db, 'evidence', id), { reportId })
    }
    await batch.commit()
  } catch (err) {
    throw new EvidenceServiceError(friendlyEvidenceMessage(err, 'Could not attach evidence to your report. Please try again.'))
  }
}
