import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVehicle, getInventory } from '../../utils/api'
import { getGalleryImages } from './utils/galleryImages'
import Lightbox from './components/Lightbox'
import styles from './VehicleDetailPage.module.css'

const LOCATION = 'San Jose, CA'
const ADDRESS = '345 Saratoga Ave, San Jose, CA 95129'
const PHONE = '(408) 982-5456'
const PHONE_TEL = 'tel:+14089825456'
const HOURS = 'Mon–Sat 10AM–5PM'

function SpecItem({ label, value }) {
  if (value === undefined || value === null || String(value).trim() === '') return null
  return (
    <div className={styles.specItem}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{String(value)}</span>
    </div>
  )
}

function VehicleNotFound() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFoundTitle}>Vehicle not found</h1>
      <p className={styles.notFoundText}>
        This vehicle may have been removed or is no longer available.
      </p>
      <Link to="/#inventory" className={styles.notFoundBtn}>
        Back to Inventory
      </Link>
    </div>
  )
}

function VehicleUnavailable() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFoundTitle}>Vehicle not available</h1>
      <p className={styles.notFoundText}>This listing is not currently published.</p>
      <Link to="/#inventory" className={styles.notFoundBtn}>
        Back to Inventory
      </Link>
    </div>
  )
}

export default function VehicleDetailPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [allVehicles, setAllVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const galleryImages = vehicle ? getGalleryImages(vehicle) : []
  const title = vehicle
    ? [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(' ')
    : ''
  const subtitle = [LOCATION, vehicle?.stockNumber].filter(Boolean).join(' · ')
  const similarVehicles = allVehicles.filter((v) => v.id !== vehicle?.id).slice(0, 3)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setNotFound(false)
        const [v, list] = await Promise.all([
          getVehicle(id),
          getInventory().then((data) => data.filter((item) => item.status === 'Published')),
        ])
        if (cancelled) return
        if (!v) {
          setNotFound(true)
          setVehicle(null)
          return
        }
        if (v.status !== 'Published') {
          setVehicle(null)
          setNotFound('unpublished')
          return
        }
        setVehicle(v)
        setAllVehicles(list)
      } catch (err) {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])


  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (notFound === true) {
    return (
      <div className={styles.page}>
        <VehicleNotFound />
      </div>
    )
  }

  if (notFound === 'unpublished') {
    return (
      <div className={styles.page}>
        <VehicleUnavailable />
      </div>
    )
  }

  if (!vehicle) return null

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/#inventory" className={styles.backLink}>
          ← Back to Inventory
        </Link>
      </div>

      <header className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <h1 className={styles.mainTitle}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.titleActions}>
          {vehicle.price > 0 && (
            <span className={styles.price}>
              ${vehicle.price.toLocaleString()}
            </span>
          )}
          <a href={PHONE_TEL} className={styles.callBtn}>
            Call {PHONE}
          </a>
        </div>
      </header>

      <section className={styles.gallerySection} aria-label="Vehicle photos">
        {galleryImages.length > 0 ? (
          <>
            <div className={styles.galleryGrid}>
              <button
                type="button"
                className={styles.galleryHero}
                onClick={() => setLightboxIndex(0)}
                aria-label="View photo 1 in full screen"
              >
                <img
                  src={galleryImages[0].url}
                  alt={galleryImages[0].alt}
                  className={styles.galleryImg}
                />
              </button>
              {[1, 2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.galleryThumb}
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View photo ${idx + 1} in full screen`}
                >
                  {galleryImages[idx] ? (
                    <img src={galleryImages[idx].url} alt={galleryImages[idx].alt} className={styles.galleryImg} />
                  ) : (
                    <span className={styles.galleryThumbPlaceholder} aria-hidden>+</span>
                  )}
                  {idx === 3 && galleryImages.length > 5 && (
                    <span className={styles.galleryShowAllOverlay}>
                      Show all photos
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.galleryCarouselWrap}>
              <div className={styles.galleryCarousel} aria-hidden="true">
                <div
                  className={styles.carouselTrack}
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className={styles.carouselSlide}
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`View photo ${i + 1} full screen`}
                    >
                      <img src={img.url} alt={img.alt} className={styles.carouselImg} />
                    </button>
                  ))}
                </div>
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={styles.carouselPrev}
                      onClick={(e) => { e.stopPropagation(); setCarouselIndex((i) => (i <= 0 ? galleryImages.length - 1 : i - 1)) }}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={styles.carouselNext}
                      onClick={(e) => { e.stopPropagation(); setCarouselIndex((i) => (i >= galleryImages.length - 1 ? 0 : i + 1)) }}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                    <span className={styles.carouselDots}>
                      {carouselIndex + 1} / {galleryImages.length}
                    </span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.galleryPlaceholder}>
            <span>No photos available</span>
          </div>
        )}
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}

      <div className={styles.mainLayout}>
        <div className={styles.leftCol}>
          <section className={styles.specsSection}>
            <h2 className={styles.sectionTitle}>Quick Specs</h2>
            <div className={styles.specsGrid}>
              <SpecItem label="VIN" value={vehicle.vin} />
              <SpecItem label="Mileage" value={vehicle.mileage > 0 ? vehicle.mileage.toLocaleString() + ' mi' : null} />
              <SpecItem label="Body style" value={vehicle.bodyClass} />
              <SpecItem label="Drivetrain" value={vehicle.driveType} />
              <SpecItem label="Transmission" value={vehicle.transmission} />
              <SpecItem label="Fuel" value={vehicle.fuelType} />
              <SpecItem label="Engine" value={vehicle.engine} />
            </div>
          </section>

          {vehicle.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>{vehicle.description}</p>
            </section>
          )}

          {vehicle.features && vehicle.features.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Features</h2>
              <ul className={styles.featuresList}>
                {vehicle.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </section>
          )}

          {vehicle.conditionNotes && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Condition & Notes</h2>
              <p className={styles.conditionNotes}>{vehicle.conditionNotes}</p>
            </section>
          )}

          {(vehicle.carfaxReportUrl || vehicle.windowStickerUrl) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Documents</h2>
              <div className={styles.docButtons}>
                {vehicle.carfaxReportUrl && (
                  <a
                    href={vehicle.carfaxReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.docBtn}
                  >
                    View Carfax Report
                  </a>
                )}
                {vehicle.windowStickerUrl && (
                  <a
                    href={vehicle.windowStickerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.docBtn}
                  >
                    View Window Sticker
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.rightCol}>
          <div className={styles.stickyCard}>
            {vehicle.price > 0 && (
              <p className={styles.cardPrice}>${vehicle.price.toLocaleString()}</p>
            )}
            <a href={PHONE_TEL} className={styles.cardCallBtn}>
              Call Now
            </a>
            <Link
              to={`/apply-for-financing?vehicleId=${encodeURIComponent(vehicle.id)}`}
              className={styles.cardFinanceBtn}
            >
              Apply For Financing
            </Link>
            <Link to="/sell-your-car" className={styles.cardSellBtn}>
              Sell Your Car
            </Link>
            <div className={styles.contactBlock}>
              <p className={styles.contactAddress}>{ADDRESS}</p>
              <p className={styles.contactHours}>Hours: {HOURS}</p>
              <a href={PHONE_TEL} className={styles.contactPhone}>
                {PHONE}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <section className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>Location</h2>
        <div className={styles.mapWrap}>
          <iframe
            title="A1 Motor Group location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.558944659368!2d-121.982396923!3d37.321315772278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808e35b3c3b3b3b3%3A0x9e0e3c3b3b3b3b3b!2s345%20Saratoga%20Ave%2C%20San%20Jose%2C%20CA%2095129!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      <div className={styles.stickyBottom}>
        <div className={styles.stickyBottomInner}>
          {vehicle.price > 0 && (
            <span className={styles.stickyPrice}>${vehicle.price.toLocaleString()}</span>
          )}
          <a href={PHONE_TEL} className={styles.stickyCallBtn}>
            Call us
          </a>
        </div>
      </div>

      {similarVehicles.length > 0 && (
        <section className={styles.similarSection}>
          <h2 className={styles.sectionTitle}>More Vehicles</h2>
          <div className={styles.similarGrid}>
            {similarVehicles.map((v) => {
              const t = [v.year, v.make, v.model].filter(Boolean).join(' ')
              return (
                <Link key={v.id} to={`/inventory/${v.id}`} className={styles.similarCard}>
                  <div className={styles.similarImgWrap}>
                    <img
                      src={v.coverPhotoUrl || '/Assests/logo.webp'}
                      alt={`${t} - exterior`}
                      className={styles.similarImg}
                    />
                  </div>
                  <div className={styles.similarBody}>
                    <h3 className={styles.similarTitle}>{t}</h3>
                    {v.price > 0 && (
                      <p className={styles.similarPrice}>${v.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
