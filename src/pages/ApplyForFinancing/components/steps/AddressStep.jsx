import { validateZip } from '../../validation'
import styles from './Steps.module.css'

const RESIDENCE_OPTIONS = [
  { value: '', label: 'Select…' },
  { value: 'rent', label: 'Rent' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'owned', label: 'Owned' },
  { value: 'other', label: 'Other' },
]

export default function AddressStep({ form, updateForm, errors, setErrors }) {
  const r = form.residential

  const update = (field, value) => {
    updateForm({ residential: { ...r, [field]: value } })
    if (field === 'zip' && errors.zip) setErrors((e) => ({ ...e, zip: validateZip(value) }))
  }

  return (
    <div className={styles.step}>
      <p className={styles.helper}>Where do you currently live?</p>
      <section className={styles.section}>
        <div className={styles.field}>
          <label htmlFor="address1" className={styles.label}>
            Address 1
          </label>
          <input
            id="address1"
            type="text"
            value={r.address1}
            onChange={(e) => update('address1', e.target.value)}
            className={styles.input}
            placeholder="Street address"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="address2" className={styles.label}>
            Address 2 <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="address2"
            type="text"
            value={r.address2}
            onChange={(e) => update('address2', e.target.value)}
            className={styles.input}
            placeholder="Apt, suite, etc."
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="city" className={styles.label}>
              City
            </label>
            <input
              id="city"
              type="text"
              value={r.city}
              onChange={(e) => update('city', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="state" className={styles.label}>
              State
            </label>
            <input
              id="state"
              type="text"
              value={r.state}
              onChange={(e) => update('state', e.target.value)}
              className={styles.input}
              placeholder="CA"
              maxLength={2}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="zip" className={styles.label}>
              ZIP
            </label>
            <input
              id="zip"
              type="text"
              inputMode="numeric"
              value={r.zip}
              onChange={(e) => update('zip', e.target.value)}
              onBlur={(e) => setErrors((prev) => ({ ...prev, zip: validateZip(e.target.value) }))}
              className={`${styles.input} ${errors.zip ? styles.inputError : ''}`}
              aria-invalid={!!errors.zip}
              placeholder="94102"
            />
            {errors.zip && (
              <p className={styles.error} role="alert">
                {errors.zip}
              </p>
            )}
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="residence-type" className={styles.label}>
            Residence type
          </label>
          <select
            id="residence-type"
            value={r.residenceType}
            onChange={(e) => update('residenceType', e.target.value)}
            className={styles.select}
          >
            {RESIDENCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {r.residenceType === 'other' && (
          <div className={styles.field}>
            <label htmlFor="residence-other" className={styles.label}>
              Please specify
            </label>
            <input
              id="residence-other"
              type="text"
              value={r.residenceTypeOther}
              onChange={(e) => update('residenceTypeOther', e.target.value)}
              className={styles.input}
            />
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="at-address-since" className={styles.label}>
            At current address since
          </label>
          <input
            id="at-address-since"
            type="date"
            value={r.atAddressSince}
            onChange={(e) => update('atAddressSince', e.target.value)}
            className={styles.input}
          />
        </div>
      </section>
    </div>
  )
}
