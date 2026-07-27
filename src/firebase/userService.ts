import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { updateUserProfile, type UserProfile } from './auth'
import { toFullPakistaniPhone, isValidPakistaniPhone } from '../lib/phone'

/** Thrown by every function in this module so callers can show a friendly message instead of a raw Firebase error. */
export class UserServiceError extends Error {}

const MAX_PHOTO_SIZE_BYTES = 8 * 1024 * 1024 // 8MB

function friendlyMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string } | null)?.code
  if (code === 'permission-denied' || code === 'storage/unauthorized') {
    return "You don't have permission to update that."
  }
  if (code === 'unavailable' || code === 'storage/retry-limit-exceeded') {
    return 'Network issue reaching the server. Please check your connection and try again.'
  }
  return fallback
}

/**
 * Uploads a new profile photo to Firebase Storage under the user's own
 * folder (users/{uid}/profile/photo), then saves the resulting download URL
 * onto the user's Firestore profile. Returns the new URL.
 */
export async function updateProfilePhoto(
  uid: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new UserServiceError('Please choose an image file for your profile photo.')
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new UserServiceError('That image is too large. Please choose a photo under 8MB.')
  }

  try {
    const storagePath = `users/${uid}/profile/photo`
    const storageRef = ref(storage, storagePath)

    const downloadUrl = await new Promise<string>((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type })
      task.on(
        'state_changed',
        (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        (err) => reject(err),
        () => getDownloadURL(task.snapshot.ref).then(resolve).catch(reject)
      )
    })

    await updateUserProfile(uid, { profilePhotoUrl: downloadUrl })
    return downloadUrl
  } catch (err) {
    if (err instanceof UserServiceError) throw err
    throw new UserServiceError(friendlyMessage(err, 'Could not upload your photo. Please try again.'))
  }
}

/** Removes the user's profile photo from Storage and clears it from their Firestore profile. */
export async function removeProfilePhoto(uid: string): Promise<void> {
  try {
    await deleteObject(ref(storage, `users/${uid}/profile/photo`)).catch((err) => {
      // If there's no photo to delete, that's fine — just clear the profile field below.
      if (err?.code !== 'storage/object-not-found') throw err
    })
    await updateUserProfile(uid, { profilePhotoUrl: null })
  } catch (err) {
    throw new UserServiceError(friendlyMessage(err, 'Could not remove your photo. Please try again.'))
  }
}

export interface PersonalDetailsInput {
  fullName: string
  fatherName: string
  dob: string
  province: string
  district: string
  tehsil: string
}

/** Updates the editable personal-details fields on a user's profile. */
export async function updatePersonalDetails(uid: string, input: PersonalDetailsInput): Promise<void> {
  const fullName = input.fullName.trim()
  const fatherName = input.fatherName.trim()
  if (!fullName) throw new UserServiceError('Full name cannot be empty.')
  if (!input.province || !input.district || !input.tehsil) {
    throw new UserServiceError('Please select your province, district, and tehsil.')
  }

  try {
    await updateUserProfile(uid, {
      fullName,
      fatherName,
      dob: input.dob,
      province: input.province,
      district: input.district,
      tehsil: input.tehsil,
    })
  } catch (err) {
    throw new UserServiceError(friendlyMessage(err, 'Could not save your details. Please try again.'))
  }
}

/** Updates the trusted emergency contact number on a user's profile. Pass an empty string to clear it. */
export async function updateEmergencyContact(uid: string, localPhone: string): Promise<void> {
  const trimmed = localPhone.trim()
  if (trimmed && !isValidPakistaniPhone(trimmed)) {
    throw new UserServiceError('Enter a valid Pakistani mobile number (e.g. 3001234567).')
  }

  try {
    await updateUserProfile(uid, {
      trustedContact: trimmed ? toFullPakistaniPhone(trimmed) : null,
    })
  } catch (err) {
    throw new UserServiceError(friendlyMessage(err, 'Could not save your emergency contact. Please try again.'))
  }
}

export type { UserProfile }
