import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing; uploads will fail.')
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const BUCKET = 'vehicle-photos'

/** Public URL for a file in the bucket (use after upload). */
export function getPublicUrl(path) {
  if (!supabase) return ''
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data?.publicUrl ?? ''
}

const MAX_PDF_SIZE = 15 * 1024 * 1024 // 15MB

/**
 * Upload a PDF document (Carfax or Window Sticker) to Supabase Storage.
 * Path: vehicles/{vehicleId}/documents/carfax.pdf | window-sticker.pdf
 * @param {string} vehicleId
 * @param {'carfax'|'windowSticker'} type
 * @param {File} file - application/pdf, max 15MB
 * @returns {Promise<string>} public URL
 */
export async function uploadDocumentToStorage(vehicleId, type, file) {
  if (!supabase) throw new Error('Supabase not configured')
  if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed')
  if (file.size > MAX_PDF_SIZE) throw new Error('File must be 15MB or less')

  const path =
    type === 'carfax'
      ? `vehicles/${vehicleId || 'temp'}/documents/carfax.pdf`
      : `vehicles/${vehicleId || 'temp'}/documents/window-sticker.pdf`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (error) throw new Error(error.message)
  return getPublicUrl(path)
}
