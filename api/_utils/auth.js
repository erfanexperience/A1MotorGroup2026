import crypto from 'crypto'

const COOKIE_NAME = 'admin_session'
const MAX_AGE = 86400 // 24 hours
const SALT = 'a1-admin-v1'

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD not set')
  return secret
}

export function createToken() {
  const secret = getSecret()
  const payload = JSON.stringify({
    rnd: crypto.randomBytes(24).toString('hex'),
    exp: Date.now() + MAX_AGE * 1000,
  })
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(payload).toString('base64url') + '.' + signature
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false
  const [payloadB64, signature] = token.split('.')
  if (!payloadB64 || !signature) return false
  try {
    const secret = getSecret()
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    if (expected !== signature) return false
    const data = JSON.parse(payload)
    if (data.exp < Date.now()) return false
    return true
  } catch {
    return false
  }
}

export function getCookie(req) {
  const raw = req.headers.cookie || ''
  const match = raw.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  return match ? decodeURIComponent(match[1].trim()) : null
}

export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${MAX_AGE}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  ])
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`,
  ])
}

export async function requireAdmin(req, res, next) {
  const token = getCookie(req)
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  await next()
}
