/**
 * Map Supabase row (snake_case) to frontend shape (camelCase).
 * Ensures photos array, coverPhotoUrl, carfaxReportUrl, windowStickerUrl.
 */
export function rowToVehicle(row, photos = []) {
  if (!row) return null
  const sorted = [...(photos || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const cover = sorted.find((p) => p.is_cover) || sorted[0]
  return {
    id: row.id,
    vin: row.vin ?? '',
    year: row.year ?? '',
    make: row.make ?? '',
    model: row.model ?? '',
    trim: row.trim ?? '',
    bodyClass: row.body_class ?? '',
    driveType: row.drive_type ?? '',
    fuelType: row.fuel_type ?? '',
    engine: row.engine ?? '',
    transmission: row.transmission ?? '',
    stockNumber: row.stock_number ?? '',
    mileage: row.mileage ?? 0,
    price: row.price ?? 0,
    exteriorColor: row.exterior_color ?? '',
    interiorColor: row.interior_color ?? '',
    interiorType: row.interior_type ?? '',
    titleStatus: row.title_status ?? 'Clean Title',
    conditionNotes: row.condition_notes ?? '',
    description: row.description ?? '',
    features: Array.isArray(row.features) ? row.features : (row.features ? [row.features] : []),
    status: row.status ?? 'Draft',
    coverPhotoUrl: row.cover_photo_url || cover?.url || '',
    carfaxReportUrl: row.carfax_url ?? '',
    windowStickerUrl: row.window_sticker_url ?? '',
    photos: sorted.map((p) => ({
      url: p.url,
      isCover: !!p.is_cover,
      order: p.sort_order ?? 0,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Map frontend vehicle payload to Supabase row (snake_case).
 */
export function vehicleToRow(v) {
  return {
    vin: v.vin ?? '',
    year: v.year ?? '',
    make: v.make ?? '',
    model: v.model ?? '',
    trim: v.trim ?? '',
    body_class: v.bodyClass ?? '',
    drive_type: v.driveType ?? '',
    fuel_type: v.fuelType ?? '',
    engine: v.engine ?? '',
    transmission: v.transmission ?? '',
    stock_number: v.stockNumber ?? '',
    mileage: v.mileage ?? 0,
    price: v.price ?? 0,
    exterior_color: v.exteriorColor ?? '',
    interior_color: v.interiorColor ?? '',
    interior_type: v.interiorType ?? '',
    title_status: v.titleStatus ?? 'Clean Title',
    condition_notes: v.conditionNotes ?? '',
    description: v.description ?? '',
    features: Array.isArray(v.features) ? v.features : [],
    status: v.status ?? 'Draft',
    cover_photo_url: v.coverPhotoUrl ?? '',
    carfax_url: v.carfaxReportUrl ?? '',
    window_sticker_url: v.windowStickerUrl ?? '',
  }
}
