import crypto from 'crypto'
import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { requireAdmin } from '../_utils/auth.js'
import { rowToVehicle, vehicleToRow } from '../_utils/vehicleMap.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    const all = req.query?.all === '1'
    let isAdmin = false
    try {
      const token = req.headers.cookie?.match(/admin_session=([^;]+)/)?.[1]
      if (token) {
        const { verifyToken } = await import('../_utils/auth.js')
        isAdmin = verifyToken(decodeURIComponent(token))
      }
    } catch (_) {}

    const { data: rows, error } = await supabaseAdmin
      .from('vehicles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('inventory list error', error)
      return res.status(500).json({ error: error.message })
    }

    let list = rows || []
    if (!all || !isAdmin) {
      list = list.filter((r) => r.status === 'Published')
    }

    const vehicleIds = list.map((r) => r.id)
    const { data: photosRows } = await supabaseAdmin
      .from('vehicle_photos')
      .select('*')
      .in('vehicle_id', vehicleIds.length ? vehicleIds : ['__none__'])

    const photosByVehicle = {}
    for (const p of photosRows || []) {
      if (!photosByVehicle[p.vehicle_id]) photosByVehicle[p.vehicle_id] = []
      photosByVehicle[p.vehicle_id].push(p)
    }

    const vehicles = list.map((row) => rowToVehicle(row, photosByVehicle[row.id] || []))
    return res.status(200).json(vehicles)
  }

  if (req.method === 'POST') {
    await requireAdmin(req, res, async () => {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const row = vehicleToRow(body)
      row.id = crypto.randomUUID()
      row.created_at = new Date().toISOString()
      row.updated_at = new Date().toISOString()

      const { data, error } = await supabaseAdmin.from('vehicles').insert(row).select('*').single()
      if (error) {
        console.error('inventory insert error', error)
        return res.status(500).json({ error: error.message })
      }
      const out = rowToVehicle(data, [])
      return res.status(200).json(out)
    })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
