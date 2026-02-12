import { VEHICLES } from '../../data'
import styles from './Steps.module.css'

export default function ReviewStep({ form }) {
  const vehicle = VEHICLES.find((v) => v.id === form.vehicleId)
  const { personal, identity, residential, employment } = form

  return (
    <div className={styles.step}>
      <p className={styles.helper}>
        Review your information below. By submitting, you confirm everything is accurate.
      </p>
      {vehicle && (
        <section className={styles.reviewBlock}>
          <p className={styles.reviewLabel}>Vehicle</p>
          <p className={styles.reviewValue}>{vehicle.name}</p>
        </section>
      )}
      <section className={styles.reviewBlock}>
        <p className={styles.reviewLabel}>Contact</p>
        <p className={styles.reviewValue}>
          {[personal.firstName, personal.lastName].filter(Boolean).join(' ')}
        </p>
        <p className={styles.reviewValue}>{personal.email}</p>
        <p className={styles.reviewValue}>{personal.phone}</p>
      </section>
      <section className={styles.reviewBlock}>
        <p className={styles.reviewLabel}>Address</p>
        <p className={styles.reviewValue}>
          {residential.address1}
          {residential.address2 ? `, ${residential.address2}` : ''}
        </p>
        <p className={styles.reviewValue}>
          {[residential.city, residential.state, residential.zip].filter(Boolean).join(', ')}
        </p>
      </section>
      <section className={styles.reviewBlock}>
        <p className={styles.reviewLabel}>Employment</p>
        <p className={styles.reviewValue}>{employment.employer}</p>
        <p className={styles.reviewValue}>{employment.occupation}</p>
        <p className={styles.reviewValue}>
          Monthly income: {employment.monthlyIncome ? `$${Number(employment.monthlyIncome).toLocaleString()}` : '—'}
        </p>
      </section>
      <section className={styles.reviewBlock}>
        <p className={styles.reviewLabel}>Identity (for our records)</p>
        <p className={styles.reviewValue}>
          DOB: {identity.dateOfBirth || '—'} · DL expires: {identity.driverLicenseExpiry || '—'}
        </p>
      </section>
    </div>
  )
}
