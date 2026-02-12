const API_BASE = '/api'

const defaultFetchOptions = (opts = {}) => ({
  credentials: 'include',
  ...opts,
})

export async function decodeVIN(vin) {
  const res = await fetch(`${API_BASE}/vin-decode`, {
    ...defaultFetchOptions(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin }),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Failed to decode VIN')
  }
  return res.json()
}

export async function getInventory(options = {}) {
  const url = options.all ? `${API_BASE}/inventory?all=1` : `${API_BASE}/inventory`
  const res = await fetch(url, defaultFetchOptions())
  if (!res.ok) throw new Error('Failed to fetch inventory')
  return res.json()
}

export async function getVehicle(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, defaultFetchOptions())
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch vehicle')
  return res.json()
}

export async function addVehicle(vehicle) {
  const res = await fetch(`${API_BASE}/inventory`, {
    ...defaultFetchOptions(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to add vehicle')
  }
  return res.json()
}

export async function updateVehicle(id, vehicle) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    ...defaultFetchOptions(),
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to update vehicle')
  }
  return res.json()
}

export async function deleteVehicle(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    ...defaultFetchOptions(),
    method: 'DELETE',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to delete vehicle')
  }
  return res.json()
}

/** Commit photo records to DB after uploading files to Supabase Storage (admin only). */
export async function commitPhotos(vehicleId, photos) {
  const res = await fetch(`${API_BASE}/photos/commit`, {
    ...defaultFetchOptions(),
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to save photos')
  }
  return res.json()
}

// --- Admin auth ---

export async function adminMe() {
  const res = await fetch(`${API_BASE}/admin/me`, defaultFetchOptions())
  if (!res.ok) return { authenticated: false }
  return res.json()
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    ...defaultFetchOptions(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Login failed')
  }
  return res.json()
}

export async function adminLogout() {
  await fetch(`${API_BASE}/admin/logout`, {
    ...defaultFetchOptions(),
    method: 'POST',
  })
}
