import { useState } from 'react'
import styles from './MaskedInput.module.css'

export default function MaskedInput({
  value,
  onChange,
  placeholder,
  id,
  label,
  helperText,
  error,
  mask = (v) => v,
  unmask = (v) => v,
  type = 'password',
  ...props
}) {
  const [show, setShow] = useState(false)

  const handleChange = (e) => {
    const raw = e.target.value
    const next = unmask(raw)
    onChange(next)
  }

  const displayValue = mask(value)

  return (
    <div className={styles.wrap}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.inputWrap} ${error ? styles.inputWrapError : ''}`}>
        <input
          id={id}
          type={show ? 'text' : type}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide value' : 'Show value'}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {helperText && (
        <p id={helperText && id ? `${id}-helper` : undefined} className={styles.helper}>
          {helperText}
        </p>
      )}
      {error && (
        <p id={id ? `${id}-error` : undefined} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
