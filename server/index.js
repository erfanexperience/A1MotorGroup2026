import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, '../public')))

const INVENTORY_FILE = join(__dirname, '../src/data/inventory.json')
const UPLOADS_DIR = join(__dirname, '../public/uploads')

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehicleId = req.body.vehicleId || 'temp'
    const vehicleDir = join(UPLOADS_DIR, vehicleId)
    if (!existsSync(vehicleDir)) {
      mkdirSync(vehicleDir, { recursive: true })
    }
    cb(null, vehicleDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({ storage })
const uploadSingle = multer({ storage }).single('document')

// Helper: Read inventory
function readInventory() {
  try {
    const data = readFileSync(INVENTORY_FILE, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    return []
  }
}

// Helper: Write inventory
function writeInventory(data) {
  writeFileSync(INVENTORY_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// VIN Decode endpoint
app.post('/api/vin-decode', async (req, res) => {
  const { vin, modelYear } = req.body

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'VIN must be 17 characters' })
  }

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`
    const response = await fetch(url)
    const data = await response.json()

    if (!data.Results || data.Results.length === 0) {
      return res.status(404).json({ error: 'No data found for this VIN' })
    }

    const result = data.Results[0]
    const normalized = {
      vin: vin,
      year: result.ModelYear || '',
      make: result.Make || '',
      model: result.Model || '',
      trim: result.Trim || result.Series || '',
      bodyClass: result.BodyClass || '',
      driveType: result.DriveType || '',
      fuelType: result.FuelTypePrimary || '',
      engine: result.EngineModel || (result.EngineCylinders ? `${result.EngineCylinders} Cylinder` : '') || '',
      transmission: result.TransmissionStyle || '',
    }

    res.json(normalized)
  } catch (error) {
    console.error('VIN decode error:', error)
    res.status(500).json({ error: 'Failed to decode VIN. Please try again or enter details manually.' })
  }
})

// GET inventory
app.get('/api/inventory', (req, res) => {
  const inventory = readInventory()
  res.json(inventory)
})

// GET inventory/:id (single vehicle)
app.get('/api/inventory/:id', (req, res) => {
  const inventory = readInventory()
  const vehicle = inventory.find((v) => v.id === req.params.id)
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' })
  }
  res.json(vehicle)
})

// POST inventory (add vehicle)
app.post('/api/inventory', (req, res) => {
  const inventory = readInventory()
  const vehicle = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  inventory.push(vehicle)
  writeInventory(inventory)
  res.json(vehicle)
})

// PUT inventory/:id (update vehicle)
app.put('/api/inventory/:id', (req, res) => {
  const inventory = readInventory()
  const index = inventory.findIndex((v) => v.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' })
  }
  inventory[index] = {
    ...inventory[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  }
  writeInventory(inventory)
  res.json(inventory[index])
})

// DELETE inventory/:id
app.delete('/api/inventory/:id', (req, res) => {
  const inventory = readInventory()
  const index = inventory.findIndex((v) => v.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' })
  }
  inventory.splice(index, 1)
  writeInventory(inventory)
  res.json({ success: true })
})

// POST upload (photo upload)
app.post('/api/upload', upload.array('photos', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' })
  }

  const vehicleId = req.body.vehicleId || 'temp'
  const urls = req.files.map((file, index) => ({
    url: `/uploads/${vehicleId}/${file.filename}`,
    isCover: false,
    order: index,
  }))

  res.json({ photos: urls })
})

// POST upload document (Window Sticker, Carfax, etc.)
app.post('/api/upload-document', (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const vehicleId = req.body.vehicleId || 'temp'
    const url = `/uploads/${vehicleId}/${req.file.filename}`
    res.json({ url })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
