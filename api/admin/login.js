import { createToken, setAuthCookie } from '../_utils/auth.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const password = body.password

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    res.status(500).json({ error: 'Server misconfiguration' })
    return
  }

  if (password !== expected) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const token = createToken()
  setAuthCookie(res, token)
  res.status(200).json({ ok: true })
}
