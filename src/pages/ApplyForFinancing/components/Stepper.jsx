import styles from './Stepper.module.css'

export default function Stepper({ steps, currentIndex }) {
  return (
    <nav className={styles.stepper} aria-label="Application progress">
      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li
            key={step.id}
            className={`${styles.item} ${i === currentIndex ? styles.current : ''} ${i < currentIndex ? styles.done : ''}`}
            aria-current={i === currentIndex ? 'step' : undefined}
          >
            <span className={styles.number}>{i + 1}</span>
            <span className={styles.title}>{step.title}</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
