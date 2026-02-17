import { useState, useEffect, useMemo } from 'react'
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
          {vehicle.price > 0 && (
            <p className={styles.cardPrice}>
              ${Number(vehicle.price).toLocaleString()}
            </p>
          )}
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
  const [filterMake, setFilterMake] = useState('')
  const [sortByPrice, setSortByPrice] = useState('')

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await getInventory()
        const published = data.filter((v) => v.status === 'Published')
        setVehicles(published)
      } catch (error) {
        console.error('Failed to load inventory:', error)
        setVehicles([])
      } finally {
        setLoading(false)
      }
    }
    loadInventory()
  }, [])

  const makes = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.make).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [vehicles])

  const filteredAndSorted = useMemo(() => {
    let list = vehicles
    if (filterMake) {
      list = list.filter((v) => v.make === filterMake)
    }
    if (sortByPrice === 'asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortByPrice === 'desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0))
    }
    return list
  }, [vehicles, filterMake, sortByPrice])

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
          <>
            <div className={styles.toolbar}>
              <label className={styles.toolbarLabel} htmlFor="filter-make">
                Filter by make
              </label>
              <select
                id="filter-make"
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className={styles.select}
                aria-label="Filter by make"
              >
                <option value="">All makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
              <label className={styles.toolbarLabel} htmlFor="sort-price">
                Sort by price
              </label>
              <select
                id="sort-price"
                value={sortByPrice}
                onChange={(e) => setSortByPrice(e.target.value)}
                className={styles.select}
                aria-label="Sort by price"
              >
                <option value="">Default</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
            {filteredAndSorted.length === 0 ? (
              <p className={styles.empty}>No vehicles match the selected filter.</p>
            ) : (
              <div className={styles.grid}>
                {filteredAndSorted.map((vehicle) => (
                  <CarCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
