import { useState, useRef } from 'react'
import { uploadPhotos } from '../../../utils/api'
import styles from './PhotoUploader.module.css'

export default function PhotoUploader({ vehicleId, photos = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      setUploading(true)
      const result = await uploadPhotos(vehicleId || 'temp', files)
      const newPhotos = [...photos, ...result.photos].map((p, i) => ({
        ...p,
        order: i,
      }))
      onChange(newPhotos)
    } catch (error) {
      alert('Failed to upload photos: ' + error.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) return

    try {
      setUploading(true)
      const result = await uploadPhotos(vehicleId || 'temp', files)
      const newPhotos = [...photos, ...result.photos].map((p, i) => ({
        ...p,
        order: i,
      }))
      onChange(newPhotos)
    } catch (error) {
      alert('Failed to upload photos: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i }))
    onChange(newPhotos)
  }

  const handleSetCover = (index) => {
    const newPhotos = photos.map((p, i) => ({
      ...p,
      isCover: i === index,
    }))
    onChange(newPhotos)
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOverItem = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newPhotos = [...photos]
    const dragged = newPhotos[draggedIndex]
    newPhotos.splice(draggedIndex, 1)
    newPhotos.splice(index, 0, dragged)
    const reordered = newPhotos.map((p, i) => ({ ...p, order: i }))
    onChange(reordered)
    setDraggedIndex(index)
  }

  return (
    <div className={styles.uploader}>
      <label className={styles.label}>Photos</label>
      <div
        className={styles.dropZone}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className={styles.dropLabel}>
          {uploading ? (
            'Uploading...'
          ) : (
            <>
              Drag photos here or <span className={styles.link}>browse</span>
            </>
          )}
        </label>
      </div>

      {photos.length > 0 && (
        <div className={styles.thumbnails}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${draggedIndex === index ? styles.dragging : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOverItem(e, index)}
            >
              <img src={photo.url} alt={`Photo ${index + 1}`} className={styles.thumbImg} />
              {photo.isCover && <span className={styles.coverBadge}>Cover</span>}
              <div className={styles.thumbActions}>
                <button
                  type="button"
                  onClick={() => handleSetCover(index)}
                  className={styles.btnSetCover}
                  disabled={photo.isCover}
                >
                  Set Cover
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className={styles.btnRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
