/** Strips spaces/dashes from a local 3XXXXXXXXX number and returns the full +92 form. */
export function toFullPakistaniPhone(localDigits: string): string {
  const cleaned = localDigits.replace(/\D/g, '')
  return `+92${cleaned}`
}

/** Validates a local Pakistani mobile number: 10 digits, starting with 3 (e.g. 3XX XXXXXXX). */
export function isValidPakistaniPhone(localDigits: string): boolean {
  const cleaned = localDigits.replace(/\D/g, '')
  return /^3\d{9}$/.test(cleaned)
}