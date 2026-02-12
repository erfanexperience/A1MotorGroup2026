import { useState, useEffect } from 'react'
import InventoryList from './components/InventoryList'
import VehicleForm from './components/VehicleForm'
import { getInventory } from '../../utils/api'
import styles from './AdminInventoryPage.module.css'

export default function AdminInventoryPage() {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadInventory = async () => {
    try {
      setLoading(true)
      const data = await getInventory()
      setVehicles(data)
    } catch (error) {
      console.error('Failed to load inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const handleVehicleSaved = () => {
    loadInventory()
    setModalOpen(false)
    setSelectedVehicle(null)
  }

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle)
    setModalOpen(true)
  }

  const handleDelete = () => {
    loadInventory()
    setModalOpen(false)
    setSelectedVehicle(null)
  }

  const openAddVehicle = () => {
    setSelectedVehicle(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedVehicle(null)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Inventory Manager</h1>
            <p className={styles.subtitle}>Manage your vehicle inventory</p>
          </div>
          <button type="button" onClick={openAddVehicle} className={styles.addBtn}>
            Add Vehicle
          </button>
        </div>
      </header>

      <div className={styles.listWrap}>
        <InventoryList
          vehicles={vehicles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={loadInventory}
        />
      </div>

      {modalOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 id="modal-title" className={styles.modalTitle}>
                {selectedVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className={styles.closeBtn}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <VehicleForm
                vehicle={selectedVehicle}
                onSave={handleVehicleSaved}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
