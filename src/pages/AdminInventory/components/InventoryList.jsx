import { useState } from 'react'
import { deleteVehicle, updateVehicle } from '../../../utils/api'
import styles from './InventoryList.module.css'

export default function InventoryList({ vehicles, loading, onEdit, onDelete, onRefresh }) {
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return
    try {
      setDeleting(id)
      await deleteVehicle(id)
      onDelete()
    } catch (error) {
      alert('Failed to delete vehicle: ' + error.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleStatus = async (vehicle) => {
    try {
      await updateVehicle(vehicle.id, {
        ...vehicle,
        status: vehicle.status === 'Published' ? 'Draft' : 'Published',
      })
      onRefresh()
    } catch (error) {
      alert('Failed to update status: ' + error.message)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading inventory...</div>
  }

  return (
    <div className={styles.list}>
      <h2 className={styles.title}>Current Inventory</h2>
      {vehicles.length === 0 ? (
        <p className={styles.empty}>No vehicles in inventory</p>
      ) : (
        <div className={styles.cards}>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={vehicle.coverPhotoUrl || '/Assests/logo.webp'}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className={styles.image}
                />
                <span className={`${styles.badge} ${vehicle.status === 'Published' ? styles.published : styles.draft}`}>
                  {vehicle.status}
                </span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.vehicleTitle}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.trim && ` ${vehicle.trim}`}
                </h3>
                <div className={styles.details}>
                  {vehicle.mileage > 0 && (
                    <span className={styles.detail}>{vehicle.mileage.toLocaleString()} mi</span>
                  )}
                  {vehicle.price > 0 && (
                    <span className={styles.detail}>${vehicle.price.toLocaleString()}</span>
                  )}
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit(vehicle)}
                    className={styles.btnEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(vehicle)}
                    className={styles.btnToggle}
                  >
                    {vehicle.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(vehicle.id)}
                    className={styles.btnDelete}
                    disabled={deleting === vehicle.id}
                  >
                    {deleting === vehicle.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
