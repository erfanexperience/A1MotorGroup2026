export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const vin = (body.vin || '').trim()

  if (vin.length !== 17) {
    res.status(400).json({ error: 'VIN must be 17 characters' })
    return
  }

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`
    const response = await fetch(url)
    const data = await response.json()

    if (!data.Results || data.Results.length === 0) {
      res.status(200).json({
        vin,
        year: '',
        make: '',
        model: '',
        trim: '',
        bodyClass: '',
        driveType: '',
        fuelType: '',
        engine: '',
        transmission: '',
      })
      return
    }

    const r = data.Results[0]
    const engine =
      r.EngineModel ||
      (r.EngineCylinders ? `${r.EngineCylinders} Cylinder` : '') ||
      ''
    const normalized = {
      vin,
      year: r.ModelYear || '',
      make: r.Make || '',
      model: r.Model || '',
      trim: r.Trim || r.Series || '',
      bodyClass: r.BodyClass || '',
      driveType: r.DriveType || '',
      fuelType: r.FuelTypePrimary || '',
      engine,
      transmission: r.TransmissionStyle || '',
    }
    res.status(200).json(normalized)
  } catch (error) {
    console.error('VIN decode error:', error)
    res.status(500).json({ error: 'Failed to decode VIN. Please try again or enter details manually.' })
  }
}
