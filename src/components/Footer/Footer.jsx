import styles from './Footer.module.css'

const ADDRESS = '345 Saratoga Ave, San Jose, CA 95129'
const PHONE = '408-982-5456'
const PHONE_TEL = 'tel:+14089825456'
const HOURS = 'Monday – Saturday: 10:00 AM – 5:00 PM'
const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Our Location</h3>
            <p className={styles.columnText}>{ADDRESS}</p>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Our Phone Number</h3>
            <a href={PHONE_TEL} className={styles.columnLink}>
              {PHONE}
            </a>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Working Hours</h3>
            <p className={styles.columnText}>{HOURS}</p>
          </div>
        </div>
        <p className={styles.copyright}>
          © {YEAR} A1 Motor Group. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
