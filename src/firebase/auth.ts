import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword as fbUpdatePassword,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { toFullPakistaniPhone } from '../lib/phone'

export interface UserProfile {
  uid: string
  fullName: string
  fatherName: string
  email: string
  phone: string
  cnic: string
  dob: string
  province: string
  district: string
  tehsil: string
  emergencyPinHash: string | null
  trustedContact: string | null
  profilePhotoUrl: string | null
  profileComplete: boolean
  createdAt: unknown
  updatedAt: unknown
}

export interface RegisterInput {
  fullName: string
  fatherName: string
  email: string
  phone: string // local digits, e.g. 3001234567
  cnic: string
  dob: string
  province: string
  district: string
  tehsil: string
  password: string
  emergencyPin?: string
  trustedContact?: string
}

/** Maps raw Firebase error codes to messages a non-technical user can act on. */
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 8 characters with a mix of letters and numbers.'
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect phone number or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection and try again.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support for help.'
    default:
      return (err as Error)?.message || 'Something went wrong. Please try again.'
  }
}

/**
 * Registers a new user in Firebase Auth, then writes their profile to Firestore
 * (`users/{uid}`) and a lightweight, non-sensitive lookup record
 * (`phoneIndex/{fullPhone}` -> { uid, email }) so phone-based sign-in can find
 * the associated email before the user is authenticated.
 */
export async function registerUser(input: RegisterInput): Promise<User> {
  const fullPhone = toFullPakistaniPhone(input.phone)

  const credential = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password)
  const { user } = credential

  try {
    const profile: UserProfile = {
      uid: user.uid,
      fullName: input.fullName.trim(),
      fatherName: input.fatherName.trim(),
      email: input.email.trim(),
      phone: fullPhone,
      cnic: input.cnic.replace(/[^0-9]/g, ''),
      dob: input.dob,
      province: input.province,
      district: input.district,
      tehsil: input.tehsil,
      emergencyPinHash: input.emergencyPin ? await sha256(input.emergencyPin) : null,
      trustedContact: input.trustedContact ? toFullPakistaniPhone(input.trustedContact) : null,
      profilePhotoUrl: null,
      profileComplete: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', user.uid), profile)
    await setDoc(doc(db, 'phoneIndex', fullPhone), { uid: user.uid, email: input.email.trim() })
  } catch (err) {
    // Roll back the auth account if profile creation fails, so we don't leave
    // an orphaned auth user with no Firestore profile behind.
    await user.delete().catch(() => {})
    throw err
  }

  return user
}

/** Looks up the email registered against a Pakistani phone number, for phone+password sign-in. */
export async function getEmailForPhone(localPhone: string): Promise<string | null> {
  const fullPhone = toFullPakistaniPhone(localPhone)
  const snap = await getDoc(doc(db, 'phoneIndex', fullPhone))
  if (!snap.exists()) return null
  return (snap.data() as { email: string }).email
}

export async function loginWithPhone(localPhone: string, password: string): Promise<User> {
  const email = await getEmailForPhone(localPhone)
  if (!email) {
    // Throw in the same shape as a Firebase auth error so friendlyAuthError handles it uniformly.
    throw { code: 'auth/invalid-credential', message: 'No account found for this phone number.' }
  }
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/** Sends a password-reset email for the account registered against the given local phone number. */
export async function resetPasswordForPhone(localPhone: string): Promise<string> {
  const email = await getEmailForPhone(localPhone)
  if (!email) {
    throw { code: 'auth/invalid-credential', message: 'No account found for this phone number.' }
  }
  await sendPasswordResetEmail(auth, email)
  return email
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() })
}

export async function changePassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Not signed in.')
  await fbUpdatePassword(auth.currentUser, newPassword)
}

/** Hashes the emergency PIN with SubtleCrypto so the raw PIN is never stored or transmitted as plain text. */
async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export { sha256 as hashPin }
