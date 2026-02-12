import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { requireAdmin } from '../_utils/auth.js'
import { rowToVehicle, vehicleToRow } from '../_utils/vehicleMap.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  const id = req.query?.id
  if (!id) return res.status(400).json({ error: 'Missing id' })

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    let isAdmin = false
    try {
      const token = req.headers.cookie?.match(/admin_session=([^;]+)/)?.[1]
      if (token) {
        const { verifyToken } = await import('../_utils/auth.js')
        isAdmin = verifyToken(decodeURIComponent(token))
      }
    } catch (_) {}

    const { data: row, error } = await supabaseAdmin.from('vehicles').select('*').eq('id', id).single()
    if (error || !row) return res.status(404).json({ error: 'Vehicle not found' })
    if (row.status !== 'Published' && !isAdmin) return res.status(404).json({ error: 'Vehicle not found' })

    const { data: photos } = await supabaseAdmin.from('vehicle_photos').select('*').eq('vehicle_id', id).order('sort_order')
    const vehicle = rowToVehicle(row, photos || [])
    return res.status(200).json(vehicle)
  }

  if (req.method === 'PUT') {
    await requireAdmin(req, res, async () => {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const update = vehicleToRow(body)
      update.updated_at = new Date().toISOString()

      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .update(update)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('inventory update error', error)
        return res.status(500).json({ error: error.message })
      }
      const { data: photos } = await supabaseAdmin.from('vehicle_photos').select('*').eq('vehicle_id', id).order('sort_order')
      return res.status(200).json(rowToVehicle(data, photos || []))
    })
    return
  }

  if (req.method === 'DELETE') {
    await requireAdmin(req, res, async () => {
      const { error: delPhotos } = await supabaseAdmin.from('vehicle_photos').delete().eq('vehicle_id', id)
      if (delPhotos) console.error('delete photos', delPhotos)
      const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ success: true })
    })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
