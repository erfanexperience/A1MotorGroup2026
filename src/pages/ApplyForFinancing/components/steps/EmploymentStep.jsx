import { formatMonthlyIncome, parseMonthlyIncome } from '../../validation'
import styles from './Steps.module.css'

const EMPLOYER_TYPES = [
  { value: '', label: 'Select…' },
  { value: 'employer', label: 'Employed' },
  { value: 'self', label: 'Self-employed' },
  { value: 'other', label: 'Other' },
]

export default function EmploymentStep({ form, updateForm }) {
  const e = form.employment

  const update = (field, value) => {
    updateForm({ employment: { ...e, [field]: value } })
  }

  const handleIncomeChange = (raw) => {
    const digits = parseMonthlyIncome(raw)
    update('monthlyIncome', digits)
  }

  const incomeDisplay = formatMonthlyIncome(e.monthlyIncome)

  return (
    <div className={styles.step}>
      <p className={styles.helper}>Tell us about your current job.</p>
      <section className={styles.section}>
        <div className={styles.field}>
          <label htmlFor="employer" className={styles.label}>
            Employer name
          </label>
          <input
            id="employer"
            type="text"
            value={e.employer}
            onChange={(ev) => update('employer', ev.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="occupation" className={styles.label}>
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              value={e.occupation}
              onChange={(ev) => update('occupation', ev.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="employer-type" className={styles.label}>
              Employer type
            </label>
            <select
              id="employer-type"
              value={e.employerType}
              onChange={(ev) => update('employerType', ev.target.value)}
              className={styles.select}
            >
              {EMPLOYER_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="monthly-income" className={styles.label}>
            Monthly income
          </label>
          <input
            id="monthly-income"
            type="text"
            inputMode="numeric"
            value={incomeDisplay}
            onChange={(ev) => handleIncomeChange(ev.target.value)}
            className={styles.input}
            placeholder="5,000"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="employer-phone" className={styles.label}>
            Employer phone number
          </label>
          <input
            id="employer-phone"
            type="tel"
            value={e.employerPhone}
            onChange={(ev) => update('employerPhone', ev.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.sectionTitle}>Employer address</div>
        <div className={styles.field}>
          <label htmlFor="emp-address1" className={styles.label}>
            Address 1
          </label>
          <input
            id="emp-address1"
            type="text"
            value={e.employerAddress1}
            onChange={(ev) => update('employerAddress1', ev.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="emp-address2" className={styles.label}>
            Address 2 <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="emp-address2"
            type="text"
            value={e.employerAddress2}
            onChange={(ev) => update('employerAddress2', ev.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="emp-city" className={styles.label}>
              City
            </label>
            <input
              id="emp-city"
              type="text"
              value={e.employerCity}
              onChange={(ev) => update('employerCity', ev.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="emp-state" className={styles.label}>
              State
            </label>
            <input
              id="emp-state"
              type="text"
              value={e.employerState}
              onChange={(ev) => update('employerState', ev.target.value)}
              className={styles.input}
              placeholder="CA"
              maxLength={2}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="emp-zip" className={styles.label}>
              ZIP
            </label>
            <input
              id="emp-zip"
              type="text"
              inputMode="numeric"
              value={e.employerZip}
              onChange={(ev) => update('employerZip', ev.target.value)}
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="at-job-since" className={styles.label}>
            At current job since
          </label>
          <input
            id="at-job-since"
            type="date"
            value={e.atJobSince}
            onChange={(ev) => update('atJobSince', ev.target.value)}
            className={styles.input}
          />
        </div>
      </section>
    </div>
  )
}
