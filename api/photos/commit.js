import crypto from 'crypto'
import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { requireAdmin } from '../_utils/auth.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await requireAdmin(req, res, async () => {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { vehicleId, photos } = body
    if (!vehicleId || !Array.isArray(photos)) {
      return res.status(400).json({ error: 'vehicleId and photos array required' })
    }

    await supabaseAdmin.from('vehicle_photos').delete().eq('vehicle_id', vehicleId)

    let onlyOneCover = false
    const rows = photos.map((p, i) => {
      const isCover = onlyOneCover ? false : !!p.isCover
      if (p.isCover) onlyOneCover = true
      return {
        id: crypto.randomUUID(),
        vehicle_id: vehicleId,
        url: p.url,
        sort_order: p.sortOrder ?? i,
        is_cover: isCover,
      }
    })
    if (rows.length && !rows.some((r) => r.is_cover)) rows[0].is_cover = true

    if (rows.length) {
      const { error } = await supabaseAdmin.from('vehicle_photos').insert(rows)
      if (error) {
        console.error('photos commit error', error)
        return res.status(500).json({ error: error.message })
      }
    }

    const cover = rows.find((r) => r.is_cover) || rows[0]
    await supabaseAdmin
      .from('vehicles')
      .update({ cover_photo_url: cover?.url || '', updated_at: new Date().toISOString() })
      .eq('id', vehicleId)

    return res.status(200).json({ ok: true })
  })
}
