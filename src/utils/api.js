const API_BASE = '/api'

export async function decodeVIN(vin, modelYear) {
  const res = await fetch(`${API_BASE}/vin-decode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin, modelYear }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to decode VIN')
  }
  return res.json()
}

export async function getInventory() {
  const res = await fetch(`${API_BASE}/inventory`)
  if (!res.ok) throw new Error('Failed to fetch inventory')
  return res.json()
}

export async function getVehicle(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch vehicle')
  return res.json()
}

export async function addVehicle(vehicle) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
  if (!res.ok) throw new Error('Failed to add vehicle')
  return res.json()
}

export async function updateVehicle(id, vehicle) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
  if (!res.ok) throw new Error('Failed to update vehicle')
  return res.json()
}

export async function deleteVehicle(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete vehicle')
  return res.json()
}

export async function uploadPhotos(vehicleId, files) {
  const formData = new FormData()
  formData.append('vehicleId', vehicleId)
  files.forEach((file) => formData.append('photos', file))

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Failed to upload photos')
  return res.json()
}

export async function uploadDocument(vehicleId, file) {
  const formData = new FormData()
  formData.append('vehicleId', vehicleId)
  formData.append('document', file)

  const res = await fetch(`${API_BASE}/upload-document`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to upload document')
  }
  return res.json()
}
