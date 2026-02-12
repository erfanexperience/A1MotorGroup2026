import { VEHICLES } from '../../data'
import styles from './Steps.module.css'

export default function VehicleStep({ form, updateForm }) {
  const selectedId = form.vehicleId
  const selectedVehicle = VEHICLES.find((v) => v.id === selectedId)

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
          {VEHICLES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
      {selectedVehicle && (
        <div className={styles.selectedVehiclePreview}>
          <img
            src={selectedVehicle.image}
            alt={selectedVehicle.name}
            className={styles.selectedVehicleImg}
            width={200}
            height={130}
          />
          <div className={styles.selectedVehicleInfo}>
            <span className={styles.vehicleName}>{selectedVehicle.name}</span>
            <span className={styles.vehicleSpecs}>{selectedVehicle.specs.join(' · ')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
