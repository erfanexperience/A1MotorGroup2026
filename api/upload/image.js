import busboy from 'busboy'
import crypto from 'crypto'
import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { getCookie, verifyToken } from '../_utils/auth.js'

export const config = { runtime: 'nodejs' }

const BUCKET = 'vehicle-photos'
const MAX_SIZE = 15 * 1024 * 1024 // 15MB

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json')
  res.status(status).json(data)
}

function publicUrl(path) {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, '')
  return base ? `${base}/storage/v1/object/public/${BUCKET}/${path}` : ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const token = getCookie(req)
  if (!verifyToken(token)) {
    return json(res, 401, { ok: false, error: 'Unauthorized' })
  }

  return new Promise((resolve) => {
    let vehicleId = 'temp'
    let fileData = null
    let fileName = ''
    let contentType = ''
    let size = 0

    const bb = busboy({ headers: req.headers })

    bb.on('field', (name, value) => {
      if (name === 'vehicleId') vehicleId = value || 'temp'
    })

    bb.on('file', (name, stream, info) => {
      if (name !== 'file') {
        stream.resume()
        return
      }
      const ct = info.mimeType || ''
      if (!ct.startsWith('image/')) {
        stream.resume()
        bb.destroy?.()
        return resolve(json(res, 400, { ok: false, error: 'File must be an image' }))
      }
      contentType = ct
      fileName = info.filename || 'image'
      const chunks = []
      stream.on('data', (chunk) => {
        size += chunk.length
        if (size > MAX_SIZE) {
          stream.destroy?.()
          return
        }
        chunks.push(chunk)
      })
      stream.on('end', () => {
        if (size > MAX_SIZE) {
          return resolve(json(res, 400, { ok: false, error: 'File must be 15MB or less' }))
        }
        fileData = Buffer.concat(chunks)
      })
      stream.on('error', () => {
        fileData = null
      })
    })

    bb.on('finish', () => {
      setImmediate(async () => {
        if (!fileData || fileData.length === 0) {
          return resolve(json(res, 400, { ok: false, error: 'No file uploaded' }))
        }
        if (size > MAX_SIZE) {
          return resolve(json(res, 400, { ok: false, error: 'File must be 15MB or less' }))
        }

        try {
        const ext = (fileName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/i, '') || 'jpg'
        const path = `vehicles/${vehicleId}/images/${crypto.randomUUID()}-${Date.now()}.${ext}`

        const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, fileData, {
          contentType: contentType || 'image/jpeg',
          upsert: false,
        })

        if (error) {
          console.error('Supabase image upload error:', error)
          return resolve(json(res, 500, { ok: false, error: 'Upload failed. Check server logs.' }))
        }

        const url = publicUrl(path)
        return resolve(json(res, 200, { ok: true, url, path }))
        } catch (err) {
          console.error('upload/image error:', err)
          return resolve(json(res, 500, { ok: false, error: 'Server error. Please try again.' }))
        }
      })
    })

    bb.on('error', (err) => {
      console.error('busboy error:', err)
      return resolve(json(res, 400, { ok: false, error: 'Invalid request' }))
    })

    req.pipe(bb)
  })
}
