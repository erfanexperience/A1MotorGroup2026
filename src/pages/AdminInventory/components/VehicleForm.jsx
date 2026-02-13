import { useState, useEffect } from 'react'
import { decodeVIN, addVehicle, updateVehicle, commitPhotos, uploadDocument } from '../../../utils/api'
import PhotoUploader from './PhotoUploader'
import styles from './VehicleForm.module.css'

const INTERIOR_TYPES = ['Leather', 'Cloth', 'Leather Trim', 'Leatherette', 'Vinyl']

const INITIAL_FORM = {
  vin: '',
  year: '',
  make: '',
  model: '',
  trim: '',
  bodyClass: '',
  driveType: '',
  fuelType: '',
  engine: '',
  transmission: '',
  stockNumber: '',
  mileage: '',
  price: '',
  exteriorColor: '',
  interiorColor: '',
  interiorType: '',
  titleStatus: 'Clean Title',
  conditionNotes: '',
  description: '',
  features: '',
  photos: [],
  coverPhotoUrl: '',
  windowStickerUrl: '',
  carfaxReportUrl: '',
}

export default function VehicleForm({ vehicle, onSave, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [decoding, setDecoding] = useState(false)
  const [decodeError, setDecodeError] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [docUploading, setDocUploading] = useState({ windowSticker: false, carfax: false })
  const [tempId] = useState(() => `temp-${Date.now()}`)

  useEffect(() => {
    if (vehicle) {
      setForm({
        ...INITIAL_FORM,
        ...vehicle,
        mileage: vehicle.mileage || '',
        price: vehicle.price || '',
        features: Array.isArray(vehicle.features) ? vehicle.features.join('\n') : vehicle.features || '',
      })
    } else {
      setForm(INITIAL_FORM)
    }
  }, [vehicle])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  const handleVINDecode = async () => {
    const vin = form.vin.trim()
    if (vin.length !== 17) {
      setDecodeError('VIN must be exactly 17 characters')
      return
    }

    try {
      setDecoding(true)
      setDecodeError('')
      const data = await decodeVIN(vin)
      setForm((prev) => ({
        ...prev,
        year: data.year || prev.year,
        make: data.make || prev.make,
        model: data.model || prev.model,
        trim: data.trim || prev.trim,
        bodyClass: data.bodyClass || prev.bodyClass,
        driveType: data.driveType || prev.driveType,
        fuelType: data.fuelType || prev.fuelType,
        engine: data.engine || prev.engine,
        transmission: data.transmission || prev.transmission,
      }))
    } catch (error) {
      setDecodeError(error.message || 'Couldn\'t fully decode this VIN. You can still enter details manually.')
    } finally {
      setDecoding(false)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.vin || form.vin.length !== 17) {
      newErrors.vin = 'VIN must be 17 characters'
    }
    if (!form.year) newErrors.year = 'Year is required'
    if (!form.make) newErrors.make = 'Make is required'
    if (!form.model) newErrors.model = 'Model is required'
    if (form.mileage && isNaN(form.mileage)) newErrors.mileage = 'Mileage must be a number'
    if (form.price && isNaN(form.price)) newErrors.price = 'Price must be a number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhotosChange = (photos) => {
    const coverPhoto = photos.find((p) => p.isCover)
    update('photos', photos)
    update('coverPhotoUrl', coverPhoto ? coverPhoto.url : photos[0]?.url || '')
  }

  const handleDocumentUpload = async (type, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed')
      return
    }
    try {
      setDocUploading((prev) => ({ ...prev, [type]: true }))
      const docType = type === 'windowSticker' ? 'windowSticker' : 'carfax'
      const url = await uploadDocument(vehicle?.id || tempId, docType, file)
      update(type === 'windowSticker' ? 'windowStickerUrl' : 'carfaxReportUrl', url)
    } catch (err) {
      alert(err.message || 'Failed to upload document')
    } finally {
      setDocUploading((prev) => ({ ...prev, [type]: false }))
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setSaving(true)
      const vehicleData = {
        ...form,
        status: 'Published',
        mileage: form.mileage ? parseInt(form.mileage, 10) : 0,
        price: form.price ? parseInt(form.price, 10) : 0,
        features: form.features ? form.features.split('\n').filter(Boolean) : [],
      }

      let saved
      if (vehicle?.id) {
        saved = await updateVehicle(vehicle.id, vehicleData)
      } else {
        saved = await addVehicle(vehicleData)
      }

      if (saved?.id && form.photos?.length > 0) {
        await commitPhotos(saved.id, form.photos)
      }
      onSave()
    } catch (error) {
      alert('Failed to save vehicle: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.title}>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* VIN Decode Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>VIN Lookup</h3>
          <div className={styles.vinRow}>
            <div className={styles.field}>
              <label htmlFor="vin" className={styles.label}>
                VIN <span className={styles.required}>*</span>
              </label>
              <input
                id="vin"
                type="text"
                value={form.vin}
                onChange={(e) => update('vin', e.target.value.toUpperCase())}
                maxLength={17}
                className={`${styles.input} ${errors.vin ? styles.inputError : ''}`}
                placeholder="17-character VIN"
              />
              {errors.vin && <p className={styles.error}>{errors.vin}</p>}
            </div>
            <button
              type="button"
              onClick={handleVINDecode}
              disabled={decoding || form.vin.length !== 17}
              className={styles.decodeBtn}
            >
              {decoding ? 'Decoding...' : 'Decode VIN'}
            </button>
          </div>
          {decodeError && (
            <div className={styles.decodeError}>
              <p>{decodeError}</p>
              <button type="button" onClick={handleVINDecode} className={styles.tryAgainBtn}>
                Try again
              </button>
            </div>
          )}
        </section>

        {/* Vehicle Details */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Vehicle Details</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="year" className={styles.label}>
                Year <span className={styles.required}>*</span>
              </label>
              <input
                id="year"
                type="text"
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                className={`${styles.input} ${errors.year ? styles.inputError : ''}`}
              />
              {errors.year && <p className={styles.error}>{errors.year}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="make" className={styles.label}>
                Make <span className={styles.required}>*</span>
              </label>
              <input
                id="make"
                type="text"
                value={form.make}
                onChange={(e) => update('make', e.target.value)}
                className={`${styles.input} ${errors.make ? styles.inputError : ''}`}
              />
              {errors.make && <p className={styles.error}>{errors.make}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="model" className={styles.label}>
                Model <span className={styles.required}>*</span>
              </label>
              <input
                id="model"
                type="text"
                value={form.model}
                onChange={(e) => update('model', e.target.value)}
                className={`${styles.input} ${errors.model ? styles.inputError : ''}`}
              />
              {errors.model && <p className={styles.error}>{errors.model}</p>}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="trim" className={styles.label}>Trim</label>
              <input
                id="trim"
                type="text"
                value={form.trim}
                onChange={(e) => update('trim', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="bodyClass" className={styles.label}>Body Class</label>
              <input
                id="bodyClass"
                type="text"
                value={form.bodyClass}
                onChange={(e) => update('bodyClass', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="transmission" className={styles.label}>Transmission</label>
              <input
                id="transmission"
                type="text"
                value={form.transmission}
                onChange={(e) => update('transmission', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="driveType" className={styles.label}>Drive Type</label>
              <input
                id="driveType"
                type="text"
                value={form.driveType}
                onChange={(e) => update('driveType', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="fuelType" className={styles.label}>Fuel Type</label>
              <input
                id="fuelType"
                type="text"
                value={form.fuelType}
                onChange={(e) => update('fuelType', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="engine" className={styles.label}>Engine</label>
              <input
                id="engine"
                type="text"
                value={form.engine}
                onChange={(e) => update('engine', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </section>

        {/* Listing Details */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Listing Details</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="stockNumber" className={styles.label}>Stock Number</label>
              <input
                id="stockNumber"
                type="text"
                value={form.stockNumber}
                onChange={(e) => update('stockNumber', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="mileage" className={styles.label}>Mileage</label>
              <input
                id="mileage"
                type="text"
                inputMode="numeric"
                value={form.mileage}
                onChange={(e) => update('mileage', e.target.value)}
                className={`${styles.input} ${errors.mileage ? styles.inputError : ''}`}
              />
              {errors.mileage && <p className={styles.error}>{errors.mileage}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="price" className={styles.label}>Price</label>
              <input
                id="price"
                type="text"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
              />
              {errors.price && <p className={styles.error}>{errors.price}</p>}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="exteriorColor" className={styles.label}>Exterior Color</label>
              <input
                id="exteriorColor"
                type="text"
                value={form.exteriorColor}
                onChange={(e) => update('exteriorColor', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="interiorColor" className={styles.label}>Interior Color</label>
              <input
                id="interiorColor"
                type="text"
                value={form.interiorColor}
                onChange={(e) => update('interiorColor', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="titleStatus" className={styles.label}>Title Status</label>
              <select
                id="titleStatus"
                value={form.titleStatus}
                onChange={(e) => update('titleStatus', e.target.value)}
                className={styles.select}
              >
                <option value="Clean Title">Clean Title</option>
                <option value="Salvage">Salvage</option>
                <option value="Rebuilt">Rebuilt</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="interiorType" className={styles.label}>Interior Type</label>
            <select
              id="interiorType"
              value={form.interiorType}
              onChange={(e) => update('interiorType', e.target.value)}
              className={styles.select}
            >
              <option value="">Select...</option>
              {INTERIOR_TYPES.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="conditionNotes" className={styles.label}>Condition Notes</label>
            <input
              id="conditionNotes"
              type="text"
              value={form.conditionNotes}
              onChange={(e) => update('conditionNotes', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={styles.textarea}
              rows={4}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="features" className={styles.label}>Features (one per line)</label>
            <textarea
              id="features"
              value={form.features}
              onChange={(e) => update('features', e.target.value)}
              className={styles.textarea}
              rows={3}
              placeholder="Leather seats&#10;Sunroof&#10;Navigation"
            />
          </div>
        </section>

        {/* Documents: Window Sticker & Carfax */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Documents</h3>
          <div className={styles.docRow}>
            <div className={styles.docField}>
              <label className={styles.label}>Window Sticker</label>
              {form.windowStickerUrl ? (
                <div className={styles.docCurrent}>
                  <a href={form.windowStickerUrl} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                    View current file
                  </a>
                  <span className={styles.docReplace}> or replace:</span>
                </div>
              ) : null}
              <label className={styles.fileLabel}>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => handleDocumentUpload('windowSticker', e)}
                  disabled={docUploading.windowSticker}
                  className={styles.fileInput}
                />
                {docUploading.windowSticker ? 'Uploading...' : form.windowStickerUrl ? 'Replace file' : 'Upload Window Sticker'}
              </label>
            </div>
            <div className={styles.docField}>
              <label className={styles.label}>Carfax Report</label>
              {form.carfaxReportUrl ? (
                <div className={styles.docCurrent}>
                  <a href={form.carfaxReportUrl} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                    View current file
                  </a>
                  <span className={styles.docReplace}> or replace:</span>
                </div>
              ) : null}
              <label className={styles.fileLabel}>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => handleDocumentUpload('carfax', e)}
                  disabled={docUploading.carfax}
                  className={styles.fileInput}
                />
                {docUploading.carfax ? 'Uploading...' : form.carfaxReportUrl ? 'Replace file' : 'Upload Carfax Report'}
              </label>
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className={styles.section}>
          <PhotoUploader
            vehicleId={vehicle?.id || tempId}
            photos={form.photos}
            onChange={handlePhotosChange}
          />
        </section>

        {/* Actions */}
        <div className={styles.actions}>
          {vehicle && (
            <button type="button" onClick={onCancel} className={styles.btnCancel}>
              Cancel
            </button>
          )}
          <button type="submit" disabled={saving} className={styles.btnSave}>
            {saving ? 'Publishing...' : 'Publish Vehicle'}
          </button>
        </div>
      </form>
    </div>
  )
}
