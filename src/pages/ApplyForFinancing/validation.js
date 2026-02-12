const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value) {
  if (!value?.trim()) return ''
  return EMAIL_RE.test(value.trim()) ? '' : 'Please enter a valid email address.'
}

export function validatePhone(value) {
  if (!value?.trim()) return ''
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 ? '' : 'Please enter at least 10 digits.'
}

export function validateZip(value) {
  if (!value?.trim()) return ''
  const digits = value.replace(/\D/g, '')
  return digits.length >= 5 ? '' : 'Please enter a valid ZIP code.'
}

export function validateRequired(value, label = 'This field') {
  if (value == null || String(value).trim() === '') return `${label} is required.`
  return ''
}

export function formatMonthlyIncome(value) {
  const digits = value.replace(/\D/g, '')
  if (digits === '') return ''
  const n = parseInt(digits, 10)
  if (isNaN(n)) return value
  return n.toLocaleString()
}

export function parseMonthlyIncome(value) {
  return value.replace(/\D/g, '')
}
