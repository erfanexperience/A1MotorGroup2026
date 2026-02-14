import styles from './Steps.module.css'

function vehicleDisplayName(v) {
  return [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ')
}

function vehicleSpecs(v) {
  return [v.bodyClass, v.transmission, v.titleStatus].filter(Boolean)
}

export default function VehicleStep({ form, updateForm, vehicles = [] }) {
  const selectedId = form.vehicleId
  const selectedVehicle = vehicles.find((v) => v.id === selectedId)

  return (
    <div className={styles.step}>
      <p className={styles.helper}>Choose the vehicle you’re interested in financing.</p>
      <div className={styles.field}>
        <label htmlFor="vehicle-select" className={styles.label}>
          Vehicle
        </label>
        <select
          id="vehicle-select"
          value={selectedId}
          onChange={(e) => updateForm({ vehicleId: e.target.value })}
          className={styles.select}
          aria-label="Select a vehicle"
        >
          <option value="">Select a vehicle…</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {vehicleDisplayName(v)}
            </option>
          ))}
        </select>
      </div>
      {selectedVehicle && (
        <div className={styles.selectedVehiclePreview}>
          <img
            src={selectedVehicle.coverPhotoUrl || '/Assests/logo.webp'}
            alt={vehicleDisplayName(selectedVehicle)}
            className={styles.selectedVehicleImg}
            width={200}
            height={130}
          />
          <div className={styles.selectedVehicleInfo}>
            <span className={styles.vehicleName}>{vehicleDisplayName(selectedVehicle)}</span>
            <span className={styles.vehicleSpecs}>{vehicleSpecs(selectedVehicle).join(' · ')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
