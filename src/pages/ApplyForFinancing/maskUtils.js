export function maskSSN(value) {
  const d = (value || '').replace(/\D/g, '').slice(0, 9)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

export function unmaskSSN(value) {
  return (value || '').replace(/\D/g, '')
}

export function maskDL(value) {
  if (!value) return ''
  if (value.length <= 4) return value
  return '•'.repeat(value.length - 4) + value.slice(-4)
}

export function unmaskDL(value) {
  return (value || '').replace(/•/g, '')
}
