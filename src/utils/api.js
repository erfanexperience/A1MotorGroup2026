const API_BASE = '/api'

const defaultFetchOptions = (opts = {}) => ({
  credentials: 'include',
  ...opts,
})

/**
 * Fetch and parse JSON. Never show raw HTML; return friendly error messages.
 * - 401 -> "Not authorized. Please log in again."
 * - 5xx -> "Server error. Please try again."
 * - Non-JSON body -> "Server error. Check Vercel logs."
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, { ...defaultFetchOptions(), ...options })
  const contentType = res.headers.get('content-type') || ''

  if (res.status === 401) {
    throw new Error('Not authorized. Please log in again.')
  }

  if (!res.ok) {
    if (contentType.includes('application/json')) {
      try {
        const data = await res.json()
        throw new Error(data.error || (res.status >= 500 ? 'Server error. Please try again.' : 'Request failed.'))
      } catch (e) {
        if (e instanceof Error && e.message !== 'Not authorized. Please log in again.') throw e
        throw new Error(res.status >= 500 ? 'Server error. Please try again.' : 'Request failed.')
      }
    }
    throw new Error(res.status >= 500 ? 'Server error. Please try again.' : 'Server error. Check Vercel logs.')
  }

  if (contentType.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      throw new Error('Server error. Check Vercel logs.')
    }
  }

  return undefined
}

export async function decodeVIN(vin) {
  const data = await apiFetch(`${API_BASE}/vin-decode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin }),
  })
  if (data && data.vin !== undefined) return data
  throw new Error('Failed to decode VIN')
}

export async function getInventory(options = {}) {
  const url = options.all ? `${API_BASE}/inventory?all=1` : `${API_BASE}/inventory`
  const data = await apiFetch(url)
  if (Array.isArray(data)) return data
  throw new Error('Failed to fetch inventory')
}

export async function getVehicle(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, defaultFetchOptions())
  if (res.status === 404) return null
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok) {
    if (contentType.includes('application/json')) {
      try {
        const d = await res.json()
        throw new Error(d.error || 'Failed to fetch vehicle')
      } catch (e) {
        if (e instanceof Error) throw e
      }
    }
    throw new Error(res.status === 401 ? 'Not authorized. Please log in again.' : 'Server error. Please try again.')
  }
  if (contentType.includes('application/json')) return res.json()
  throw new Error('Server error. Check Vercel logs.')
}

export async function addVehicle(vehicle) {
  const data = await apiFetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
  if (data && data.id) return data
  throw new Error('Failed to add vehicle')
}

export async function updateVehicle(id, vehicle) {
  const data = await apiFetch(`${API_BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
  if (data && (data.id || data.vin !== undefined)) return data
  throw new Error('Failed to update vehicle')
}

export async function deleteVehicle(id) {
  await apiFetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' })
  return {}
}

/** Commit photo records to DB after uploading files via /api/upload/image (admin only). */
export async function commitPhotos(vehicleId, photos) {
  await apiFetch(`${API_BASE}/photos/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicleId,
      photos: photos.map((p, i) => ({
        url: p.url,
        sortOrder: p.order ?? i,
        isCover: !!p.isCover,
      })),
    }),
  })
  return {}
}

/**
 * Upload one image via serverless API (admin only). Returns { url, path }.
 */
export async function uploadImage(vehicleId, file) {
  const form = new FormData()
  form.append('vehicleId', vehicleId || 'temp')
  form.append('file', file)
  const data = await apiFetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    body: form,
  })
  if (data && data.ok && data.url) return { url: data.url, path: data.path }
  throw new Error(data?.error || 'Image upload failed')
}

/**
 * Upload PDF document via serverless API (admin only). Returns { url, docType }.
 */
export async function uploadDocument(vehicleId, docType, file) {
  const form = new FormData()
  form.append('vehicleId', vehicleId || 'temp')
  form.append('docType', docType === 'windowSticker' ? 'window-sticker' : 'carfax')
  form.append('file', file)
  const data = await apiFetch(`${API_BASE}/upload/document`, {
    method: 'POST',
    body: form,
  })
  if (data && data.ok && data.url) return data.url
  throw new Error(data?.error || 'Document upload failed')
}

// --- Admin auth ---

export async function adminMe() {
  const res = await fetch(`${API_BASE}/admin/me`, defaultFetchOptions())
  if (!res.ok) return { authenticated: false }
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) return { authenticated: false }
  try {
    return await res.json()
  } catch {
    return { authenticated: false }
  }
}

export async function adminLogin(password) {
  const data = await apiFetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (data && data.ok) return data
  throw new Error('Login failed')
}

export async function adminLogout() {
  await fetch(`${API_BASE}/admin/logout`, { ...defaultFetchOptions(), method: 'POST' })
}
