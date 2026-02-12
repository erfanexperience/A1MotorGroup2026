const TOYOTA_4RUNNER_FALLBACK_BASE = '/Assests/Cars/2021 Toyota 4Runner/2021 Toyota 4Runner'

function getToyota4RunnerFallback() {
  const urls = []
  for (let i = 1; i <= 16; i++) {
    urls.push({ url: `${TOYOTA_4RUNNER_FALLBACK_BASE}  ${i}.webp`, alt: `2021 Toyota 4Runner view ${i}` })
  }
  return urls
}

function isToyota4RunnerDemo(vehicle) {
  if (!vehicle) return false
  return (
    vehicle.id === '2021-toyota-4runner' ||
    (vehicle.year === 2021 && vehicle.make === 'Toyota' && vehicle.model === '4Runner')
  )
}

/**
 * Returns array of { url, alt } for the vehicle gallery.
 * Uses vehicle.photos (with cover first) or coverPhotoUrl; fallback for Toyota 4Runner demo to 16 images.
 */
export function getGalleryImages(vehicle) {
  if (!vehicle) return []

  const useFallback =
    isToyota4RunnerDemo(vehicle) &&
    (!vehicle.photos || !Array.isArray(vehicle.photos) || vehicle.photos.length < 2)

  if (useFallback) {
    return getToyota4RunnerFallback()
  }

  const photos = vehicle.photos && Array.isArray(vehicle.photos) ? [...vehicle.photos] : []
  if (photos.length === 0 && vehicle.coverPhotoUrl) {
    photos.push({ url: vehicle.coverPhotoUrl, isCover: true, order: 0 })
  }
  photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const title = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  return photos.map((p, i) => ({
    url: p.url,
    alt: `${title} - view ${i + 1}`,
  }))
}
