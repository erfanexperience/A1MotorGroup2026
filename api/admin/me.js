import { getCookie, verifyToken } from '../_utils/auth.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const token = getCookie(req)
  const authenticated = verifyToken(token)
  res.status(200).json({ authenticated: !!authenticated })
}
