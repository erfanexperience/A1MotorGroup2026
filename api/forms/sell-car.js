import { Resend } from 'resend'
import { json, getClientIp, rateLimitCheck } from '../_utils/forms.js'

export const config = { runtime: 'nodejs' }

const HONEYPOT_FIELD = 'website'

function buildBody(data) {
  const entries = Object.entries(data).filter(([k, v]) => k !== HONEYPOT_FIELD && v != null && String(v).trim() !== '')
  const rows = entries.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(String(v))}</td></tr>`).join('')
  return `
    <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
    <p><strong>Form:</strong> Sell Your Car</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
      <thead><tr><th>Field</th><th>Value</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  if (!rateLimitCheck(ip)) {
    return json(res, 429, { ok: false, error: 'Too many submissions. Please try again later.' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return json(res, 400, { ok: false, error: 'Invalid JSON' })
  }

  if (body[HONEYPOT_FIELD] != null && String(body[HONEYPOT_FIELD]).trim() !== '') {
    return json(res, 200, { ok: true })
  }

  const firstName = String(body.firstName || '').trim()
  const lastName = String(body.lastName || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const name = [firstName, lastName].filter(Boolean).join(' ') || '—'

  if (!name || (name === '—' && !firstName && !lastName)) {
    return json(res, 400, { ok: false, error: 'Please provide your name.' })
  }
  if (!email && !phone) {
    return json(res, 400, { ok: false, error: 'Please provide your email or phone number.' })
  }

  const from = process.env.LEADS_FROM_EMAIL
  const to = process.env.LEADS_TO_EMAIL
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || !to) {
    console.error('Missing RESEND_API_KEY or LEADS_TO_EMAIL')
    return json(res, 500, { ok: false, error: 'Server error. Please try again later.' })
  }

  const subject = `A1 Lead — Sell Your Car — ${name} — ${phone || email}`

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: from || 'onboarding@resend.dev',
      to,
      subject,
      html: buildBody(body),
    })
    if (error) {
      console.error('Resend sell-car error:', error)
      return json(res, 500, { ok: false, error: 'Failed to send. Please try again later.' })
    }
    return json(res, 200, { ok: true })
  } catch (err) {
    console.error('Sell-car email error:', err)
    return json(res, 500, { ok: false, error: 'Server error. Please try again later.' })
  }
}
