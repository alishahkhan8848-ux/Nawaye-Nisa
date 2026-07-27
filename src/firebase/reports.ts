import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
  type FieldValue,
} from 'firebase/firestore'
import { db } from './firebase'

export type RiskLevel = 'immediate' | 'high' | 'medium' | 'low'
export type ReportStatus = 'draft' | 'submitted'

export interface ReportInput {
  category: string
  province: string
  district: string
  tehsil: string
  address: string
  policeStation: string
  hospital: string
  protectionCenter: string
  date: string
  time: string
  riskLevel: RiskLevel | ''
  relationship: string
  witnessAvailable: boolean | null
  witnessContact: string
  emergencyContact: string
  description: string
}

export interface CreatedReport {
  id: string
  referenceId: string
}

/**
 * Full shape of a report document as stored in Firestore, including fields
 * that are only ever set after creation (evidence links, AI summary) rather
 * than at initial submission.
 */
export interface Report extends ReportInput {
  id: string
  uid: string
  status: ReportStatus
  referenceId: string
  evidenceUrls: string[]
  aiSummary: string | null
  createdAt: Timestamp | FieldValue | null
  updatedAt: Timestamp | FieldValue | null
}

/** Fields callers are allowed to change after a report already exists. */
export interface ReportUpdateInput {
  category?: string
  province?: string
  district?: string
  tehsil?: string
  address?: string
  policeStation?: string
  hospital?: string
  protectionCenter?: string
  date?: string
  time?: string
  riskLevel?: RiskLevel | ''
  relationship?: string
  witnessAvailable?: boolean | null
  witnessContact?: string
  emergencyContact?: string
  description?: string
  status?: ReportStatus
  evidenceUrls?: string[]
  aiSummary?: string | null
}

/** Thrown by every function in this module so callers can show a friendly message instead of a raw Firebase error. */
export class ReportServiceError extends Error {}

/** Turns a Firestore auto-id into a short, readable case reference like NWN-2026-8F3K21. */
function referenceIdFor(docId: string): string {
  const year = new Date().getFullYear()
  return `NWN-${year}-${docId.slice(0, 6).toUpperCase()}`
}

function friendlyMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string } | null)?.code
  if (code === 'permission-denied') return "You don't have permission to access that report."
  if (code === 'unavailable') return 'Network issue reaching the server. Please check your connection and try again.'
  if (code === 'not-found') return 'That report could not be found.'
  return fallback
}

/** Creates a new incident report owned by `uid`. Used for both "Submit" and "Save Draft". */
export async function createReport(uid: string, input: ReportInput, status: ReportStatus): Promise<CreatedReport> {
  try {
    // Pre-generate the doc reference (and therefore its ID) so referenceId can be computed and
    // written in the SAME call as the rest of the report — one atomic write instead of two, and
    // no window where the report exists without a referenceId if a second write were to fail.
    const docRef = doc(collection(db, 'reports'))
    const referenceId = referenceIdFor(docRef.id)
    await setDoc(docRef, {
      uid,
      status,
      evidenceUrls: [],
      aiSummary: null,
      ...input,
      referenceId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, referenceId }
  } catch (err) {
    throw new ReportServiceError(friendlyMessage(err, 'Could not save your report. Please try again.'))
  }
}

/** Fetches a single report by id. Returns null if it doesn't exist (Firestore security rules still enforce ownership). */
export async function getReport(reportId: string): Promise<Report | null> {
  try {
    const snap = await getDoc(doc(db, 'reports', reportId))
    if (!snap.exists()) return null
    return { id: snap.id, ...(snap.data() as Omit<Report, 'id'>) }
  } catch (err) {
    throw new ReportServiceError(friendlyMessage(err, 'Could not load that report. Please try again.'))
  }
}

/** Fetches every report belonging to `uid`, newest first. Firestore security rules guarantee no other user's reports can be read this way. */
export async function getUserReports(uid: string): Promise<Report[]> {
  try {
    const q = query(collection(db, 'reports'), where('uid', '==', uid), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Report, 'id'>) }))
  } catch (err) {
    throw new ReportServiceError(friendlyMessage(err, 'Could not load your reports. Please try again.'))
  }
}

/** Updates fields on an existing report (e.g. status change, attaching evidenceUrls, AI-generated summary). */
export async function updateReport(reportId: string, updates: ReportUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (err) {
    throw new ReportServiceError(friendlyMessage(err, 'Could not update your report. Please try again.'))
  }
}

/** Permanently deletes a report. Does not delete associated evidence files/records — call evidenceService (deleteEvidence) separately for those. */
export async function deleteReport(reportId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'reports', reportId))
  } catch (err) {
    throw new ReportServiceError(friendlyMessage(err, 'Could not delete your report. Please try again.'))
  }
}
