/**
 * Shared helpers for public form API routes: JSON response, client IP, rate limit.
 */

const RATE_WINDOW_MS = 15 * 60 * 1000 // 15 min
const RATE_MAX = 5
const rateMap = new Map()

export function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json')
  res.status(status).json(data)
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    const first = typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]
    return (first || '').trim() || req.socket?.remoteAddress || 'unknown'
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

export function rateLimitCheck(ip) {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (now >= entry.resetAt) {
    entry.count = 1
    entry.resetAt = now + RATE_WINDOW_MS
    return true
  }
  entry.count++
  if (entry.count > RATE_MAX) return false
  return true
}
