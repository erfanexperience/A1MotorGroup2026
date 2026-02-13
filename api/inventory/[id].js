import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { requireAdmin } from '../_utils/auth.js'
import { rowToVehicle, vehicleToRow } from '../_utils/vehicleMap.js'

export const config = { runtime: 'nodejs' }

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json')
  return res.status(status).json(data)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  const id = req.query?.id
  if (!id) return json(res, 400, { ok: false, error: 'Missing id' })

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
    if (error || !row) return json(res, 404, { error: 'Vehicle not found' })
    if (row.status !== 'Published' && !isAdmin) return json(res, 404, { error: 'Vehicle not found' })

    const { data: photos } = await supabaseAdmin.from('vehicle_photos').select('*').eq('vehicle_id', id).order('sort_order')
    const vehicle = rowToVehicle(row, photos || [])
    return json(res, 200, vehicle)
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
        console.error('inventory update error', { id, supabaseError: error })
        return json(res, 500, { ok: false, error: error.message })
      }
      const { data: photos } = await supabaseAdmin.from('vehicle_photos').select('*').eq('vehicle_id', id).order('sort_order')
      return json(res, 200, rowToVehicle(data, photos || []))
    })
    return
  }

  if (req.method === 'DELETE') {
    await requireAdmin(req, res, async () => {
      const { error: delPhotos } = await supabaseAdmin.from('vehicle_photos').delete().eq('vehicle_id', id)
      if (delPhotos) console.error('delete vehicle_photos error', { id, supabaseError: delPhotos })
      const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id)
      if (error) {
        console.error('delete vehicle error', { id, supabaseError: error })
        return json(res, 500, { ok: false, error: 'Server error. Please try again.' })
      }
      return json(res, 200, { ok: true })
    })
    return
  }

  return json(res, 405, { error: 'Method not allowed' })
}
