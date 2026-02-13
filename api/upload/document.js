import busboy from 'busboy'
import { supabaseAdmin } from '../_utils/supabaseAdmin.js'
import { getCookie, verifyToken } from '../_utils/auth.js'

export const config = { runtime: 'nodejs' }

const BUCKET = 'vehicle-photos'
const MAX_SIZE = 15 * 1024 * 1024 // 15MB
const ALLOWED_TYPES = ['carfax', 'window-sticker']

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
    let docType = ''
    let fileData = null
    let size = 0

    const bb = busboy({ headers: req.headers })

    bb.on('field', (name, value) => {
      if (name === 'vehicleId') vehicleId = value || 'temp'
      if (name === 'docType') docType = (value || '').toLowerCase()
    })

    bb.on('file', (name, stream, info) => {
      if (name !== 'file') {
        stream.resume()
        return
      }
      const ct = info.mimeType || ''
      if (ct !== 'application/pdf') {
        stream.resume()
        bb.destroy?.()
        return resolve(json(res, 400, { ok: false, error: 'File must be a PDF' }))
      }
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
        if (!ALLOWED_TYPES.includes(docType)) {
          return resolve(json(res, 400, { ok: false, error: 'docType must be carfax or window-sticker' }))
        }
        if (!fileData || fileData.length === 0) {
          return resolve(json(res, 400, { ok: false, error: 'No file uploaded' }))
        }
        if (size > MAX_SIZE) {
          return resolve(json(res, 400, { ok: false, error: 'File must be 15MB or less' }))
        }

        const filename = docType === 'carfax' ? 'carfax.pdf' : 'window-sticker.pdf'
        const path = `vehicles/${vehicleId}/documents/${filename}`

        try {
        const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, fileData, {
          contentType: 'application/pdf',
          upsert: true,
        })

        if (error) {
          console.error('Supabase document upload error:', error)
          return resolve(json(res, 500, { ok: false, error: 'Upload failed. Check server logs.' }))
        }

        const url = publicUrl(path)
        return resolve(json(res, 200, { ok: true, url, path, docType }))
        } catch (err) {
          console.error('upload/document error:', err)
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
