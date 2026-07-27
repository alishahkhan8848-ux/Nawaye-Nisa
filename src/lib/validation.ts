/** Shared validation helpers used across auth screens. Pure functions, no side effects. */

export function isValidEmail(email: string): boolean {
  // Standard, pragmatic email check (not RFC-5322 exhaustive, but catches real mistakes).
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

/** Accepts CNIC as 13 digits, with or without dashes: 12345-1234567-1 or 1234512345671. */
export function isValidCnic(cnic: string): boolean {
  const cleaned = cnic.replace(/[^0-9]/g, '')
  return /^\d{13}$/.test(cleaned)
}

/** Formats raw digits into the standard XXXXX-XXXXXXX-X CNIC display format as the user types. */
export function formatCnic(input: string): string {
  const digits = input.replace(/[^0-9]/g, '').slice(0, 13)
  const part1 = digits.slice(0, 5)
  const part2 = digits.slice(5, 12)
  const part3 = digits.slice(12, 13)
  return [part1, part2, part3].filter(Boolean).join('-')
}

export function isAdult(dob: string): boolean {
  if (!dob) return false
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return false
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age >= 18
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong'
  hasMinLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export function getPasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const passed = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
  const score = (Math.max(0, passed - 1) as 0 | 1 | 2 | 3 | 4)
  const labels: PasswordStrength['label'][] = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']

  return { score, label: labels[score], hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial }
}

export function isStrongEnoughPassword(password: string): boolean {
  const s = getPasswordStrength(password)
  return s.hasMinLength && s.hasUpper && s.hasLower && s.hasNumber
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}
