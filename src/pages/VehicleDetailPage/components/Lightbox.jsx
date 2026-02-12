import { useEffect, useRef, useCallback } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ images, currentIndex, onClose, onIndexChange }) {
  const overlayRef = useRef(null)
  const prevBtnRef = useRef(null)

  const goPrev = useCallback(() => {
    onIndexChange(currentIndex <= 0 ? images.length - 1 : currentIndex - 1)
  }, [currentIndex, images.length, onIndexChange])

  const goNext = useCallback(() => {
    onIndexChange(currentIndex >= images.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, images.length, onIndexChange])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    },
    [onClose, goPrev, goNext]
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const focusablesRef = useRef([])

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    const focusables = el.querySelectorAll('button')
    focusablesRef.current = [...focusables]
    focusables[0]?.focus()
  }, [])

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    const handleTab = (e) => {
      if (e.key !== 'Tab') return
      const focusables = focusablesRef.current
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    el.addEventListener('keydown', handleTab)
    return () => el.removeEventListener('keydown', handleTab)
  }, [])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!images.length) return null

  const current = images[currentIndex]
  const alt = current?.alt ?? `Image ${currentIndex + 1} of ${images.length}`

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ×
      </button>

      <button
        type="button"
        className={styles.arrowLeft}
        onClick={goPrev}
        aria-label="Previous image"
      >
        ‹
      </button>

      <div className={styles.imageWrap}>
        <img
          src={current?.url}
          alt={alt}
          className={styles.image}
          draggable={false}
        />
        <p className={styles.counter} aria-live="polite">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      <button
        type="button"
        className={styles.arrowRight}
        onClick={goNext}
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  )
}
