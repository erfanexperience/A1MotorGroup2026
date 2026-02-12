import MaskedInput from '../MaskedInput'
import { maskSSN, unmaskSSN } from '../../maskUtils'
import styles from './Steps.module.css'

const MARITAL_OPTIONS = [
  { value: '', label: 'Select…' },
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]

export default function IdentityStep({ form, updateForm }) {
  const id = form.identity

  const update = (field, value) => {
    updateForm({ identity: { ...id, [field]: value } })
  }

  return (
    <div className={styles.step}>
      <p className={styles.helper}>
        Used for credit application only. Your information is secure.
      </p>
      <section className={styles.section}>
        <div className={styles.field}>
          <label htmlFor="dob" className={styles.label}>
            Date of birth
          </label>
          <input
            id="dob"
            type="date"
            value={id.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            className={styles.input}
          />
        </div>
        <MaskedInput
          id="ssn"
          label="Social Security Number"
          value={id.ssn}
          onChange={(v) => update('ssn', v)}
          mask={maskSSN}
          unmask={unmaskSSN}
          placeholder="XXX-XX-XXXX"
          helperText="Used for credit application only."
        />
        <MaskedInput
          id="dl-number"
          label="Driver's license number"
          value={id.driverLicenseNumber}
          onChange={(v) => update('driverLicenseNumber', v)}
          mask={(v) => v}
          unmask={(v) => v}
          helperText="Used for credit application only."
        />
        <div className={styles.field}>
          <label htmlFor="dl-expiry" className={styles.label}>
            Driver's license expiry date
          </label>
          <input
            id="dl-expiry"
            type="date"
            value={id.driverLicenseExpiry}
            onChange={(e) => update('driverLicenseExpiry', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="marital" className={styles.label}>
            Marital status
          </label>
          <select
            id="marital"
            value={id.maritalStatus}
            onChange={(e) => update('maritalStatus', e.target.value)}
            className={styles.select}
          >
            {MARITAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  )
}
