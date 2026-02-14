import { useState, useEffect } from 'react'
import InventoryList from './components/InventoryList'
import VehicleForm from './components/VehicleForm'
import { getInventory, adminMe, adminLogin, adminLogout } from '../../utils/api'
import styles from './AdminInventoryPage.module.css'

export default function AdminInventoryPage() {
  const [authChecked, setAuthChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminMe()
      .then((r) => {
        setAuthenticated(r.authenticated === true)
        if (r.authenticated) loadInventory()
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true))
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const data = await getInventory({ all: true })
      setVehicles(data)
    } catch (error) {
      console.error('Failed to load inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      await adminLogin(password)
      setAuthenticated(true)
      setPassword('')
      loadInventory()
    } catch (err) {
      setLoginError(err.message || 'Invalid password')
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    setAuthenticated(false)
    setVehicles([])
  }

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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (!authChecked) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Checking access...</div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          <p className={styles.loginSubtitle}>Enter password to manage inventory</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.loginInput}
              autoFocus
              aria-label="Password"
            />
            {loginError && <p className={styles.loginError} role="alert">{loginError}</p>}
            <button type="submit" className={styles.loginBtn}>
              Log in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <img src="/Assests/Nick.webp" alt="" className={styles.greetingAvatar} width={72} height={72} />
        <p className={styles.greetingText}>{getGreeting()}, Nick</p>
      </div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Inventory Manager</h1>
            <p className={styles.subtitle}>Manage your vehicle inventory</p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" onClick={openAddVehicle} className={styles.addBtn}>
              Add Vehicle
            </button>
            <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </div>
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
