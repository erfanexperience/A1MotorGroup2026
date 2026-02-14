import styles from './SummaryPanel.module.css'

function vehicleDisplayName(v) {
  return v ? [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ') : ''
}

export default function SummaryPanel({ form, vehicles = [] }) {
  const vehicle = vehicles.find((v) => v.id === form.vehicleId)
  const { personal, residential, consents } = form

  return (
    <aside className={styles.panel} aria-label="Application summary">
      <h3 className={styles.heading}>Summary</h3>

      {vehicle && (
        <div className={styles.block}>
          <p className={styles.blockLabel}>Vehicle</p>
          <div className={styles.vehicle}>
            <img
              src={vehicle.coverPhotoUrl || '/Assests/logo.webp'}
              alt=""
              className={styles.vehicleImg}
              width={80}
              height={52}
            />
            <span className={styles.vehicleName}>{vehicleDisplayName(vehicle)}</span>
          </div>
        </div>
      )}

      {(personal.firstName || personal.lastName || personal.email || personal.phone) && (
        <div className={styles.block}>
          <p className={styles.blockLabel}>Contact</p>
          <p className={styles.text}>
            {[personal.firstName, personal.lastName].filter(Boolean).join(' ') || '—'}
          </p>
          {personal.email && <p className={styles.text}>{personal.email}</p>}
          {personal.phone && <p className={styles.text}>{personal.phone}</p>}
        </div>
      )}

      {(residential.city || residential.state || residential.zip) && (
        <div className={styles.block}>
          <p className={styles.blockLabel}>Address</p>
          <p className={styles.text}>
            {[residential.city, residential.state, residential.zip].filter(Boolean).join(', ') || '—'}
          </p>
        </div>
      )}

      <div className={styles.block}>
        <p className={styles.blockLabel}>Review checklist</p>
        <ul className={styles.checklist}>
          <li className={vehicle ? styles.done : ''}>Vehicle selected</li>
          <li className={personal.email ? styles.done : ''}>Contact info</li>
          <li className={form.identity.ssn ? styles.done : ''}>Identity</li>
          <li className={residential.address1 ? styles.done : ''}>Address</li>
          <li className={form.employment.employer ? styles.done : ''}>Employment</li>
          <li className={consents.reviewAccepted ? styles.done : ''}>Ready to submit</li>
        </ul>
      </div>
    </aside>
  )
}
