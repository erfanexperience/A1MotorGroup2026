import { validateEmail, validatePhone } from '../../validation'
import styles from './Steps.module.css'

export default function ContactStep({ form, updateForm, errors, setErrors }) {
  const p = form.personal

  const update = (field, value) => {
    updateForm({ personal: { ...p, [field]: value } })
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  const onBlur = (field, validator) => (e) => {
    const v = e.target.value
    const err = validator(v)
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  return (
    <div className={styles.step}>
      <p className={styles.helper}>We’ll use this to get in touch about your application.</p>
      <section className={styles.section}>
        <div className={styles.row}>
          <Field
            label="First name"
            id="first-name"
            value={p.firstName}
            onChange={(v) => update('firstName', v)}
            error={errors.firstName}
          />
          <Field
            label="Last name"
            id="last-name"
            value={p.lastName}
            onChange={(v) => update('lastName', v)}
            error={errors.lastName}
          />
        </div>
        <Field
          label="Email address"
          id="email"
          type="email"
          value={p.email}
          onChange={(v) => update('email', v)}
          onBlur={onBlur('email', validateEmail)}
          error={errors.email}
        />
        <Field
          label="Phone number"
          id="phone"
          type="tel"
          value={p.phone}
          onChange={(v) => update('phone', v)}
          onBlur={onBlur('phone', validatePhone)}
          error={errors.phone}
          placeholder="(555) 123-4567"
        />
      </section>
    </div>
  )
}

function Field({ label, id, value, onChange, onBlur, error, type = 'text', placeholder }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p id={`${id}-err`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
