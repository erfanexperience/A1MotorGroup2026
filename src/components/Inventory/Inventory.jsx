import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getInventory } from '../../utils/api'
import styles from './Inventory.module.css'

function CarCard({ vehicle }) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
  const specs = [
    vehicle.bodyClass,
    vehicle.transmission,
    vehicle.titleStatus,
  ].filter(Boolean)

  return (
    <article className={styles.card}>
      <Link to={`/inventory/${vehicle.id}`} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <img
            src={vehicle.coverPhotoUrl || '/Assests/logo.webp'}
            alt={`${title} - exterior view`}
            width="400"
            height="260"
            loading="lazy"
            decoding="async"
            className={styles.image}
          />
        </div>
        <div className={styles.body}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {specs.length > 0 && (
            <ul className={styles.specs} aria-label="Key specs">
              {specs.map((spec, i) => (
                <li key={i}>{spec}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  )
}

export default function Inventory() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await getInventory()
        const published = data.filter((v) => v.status === 'Published')
        setVehicles(published)
      } catch (error) {
        console.error('Failed to load inventory:', error)
        // Fallback to empty array if API fails
        setVehicles([])
      } finally {
        setLoading(false)
      }
    }
    loadInventory()
  }, [])

  return (
    <section id="inventory" className={styles.section} aria-labelledby="inventory-title">
      <div className={styles.container}>
        <h2 id="inventory-title" className={styles.title}>
          Inventory
        </h2>
        {loading ? (
          <p className={styles.loading}>Loading inventory...</p>
        ) : vehicles.length === 0 ? (
          <p className={styles.empty}>No vehicles available at this time.</p>
        ) : (
          <div className={styles.grid}>
            {vehicles.map((vehicle) => (
              <CarCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
