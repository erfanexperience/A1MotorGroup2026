import crypto from 'crypto'
import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { requireAdmin } from '../_utils/auth.js'
import { rowToVehicle, vehicleToRow } from '../_utils/vehicleMap.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    const all = req.query?.all === '1'
    const singleId = req.query?.id
    let isAdmin = false
    try {
      const token = req.headers.cookie?.match(/admin_session=([^;]+)/)?.[1]
      if (token) {
        const { verifyToken } = await import('../_utils/auth.js')
        isAdmin = verifyToken(decodeURIComponent(token))
      }
    } catch (_) {}

    if (singleId) {
      const { data: row, error } = await supabaseAdmin.from('vehicles').select('*').eq('id', singleId).single()
      if (error || !row) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(404).json({ error: 'Vehicle not found' })
      }
      if (row.status !== 'Published' && !isAdmin) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(404).json({ error: 'Vehicle not found' })
      }
      const { data: photos } = await supabaseAdmin.from('vehicle_photos').select('*').eq('vehicle_id', singleId).order('sort_order')
      const vehicle = rowToVehicle(row, photos || [])
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json(vehicle)
    }

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
    res.setHeader('Content-Type', 'application/json')
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

  if (req.method === 'PUT') {
    let id = req.query?.id
    if (!id && typeof req.url === 'string') {
      const m = req.url.match(/\/api\/inventory\/([^/?]+)/)
      if (m) id = m[1]
    }
    if (!id) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ ok: false, error: 'Missing id' })
    }
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
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({ ok: false, error: error.message })
      }
      const { data: photos } = await supabaseAdmin.from('vehicle_photos').select('*').eq('vehicle_id', id).order('sort_order')
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json(rowToVehicle(data, photos || []))
    })
    return
  }

  if (req.method === 'DELETE') {
    let id = req.query?.id
    if (!id && typeof req.url === 'string') {
      const m = req.url.match(/\/api\/inventory\/([^/?]+)/)
      if (m) id = m[1]
    }
    if (!id) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(400).json({ ok: false, error: 'Missing id' })
    }
    await requireAdmin(req, res, async () => {
      const { error: delPhotos } = await supabaseAdmin.from('vehicle_photos').delete().eq('vehicle_id', id)
      if (delPhotos) console.error('delete vehicle_photos error', { id, supabaseError: delPhotos })
      const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id)
      if (error) {
        console.error('delete vehicle error', { id, supabaseError: error })
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({ ok: false, error: 'Server error. Please try again.' })
      }
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json({ ok: true })
    })
    return
  }

  res.setHeader('Content-Type', 'application/json')
  res.status(405).json({ error: 'Method not allowed' })
}
