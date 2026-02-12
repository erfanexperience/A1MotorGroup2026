import styles from './Contact.module.css'

const ADDRESS = '345 Saratoga Ave, San Jose, CA 95129'
const PHONE = '(408) 982-5456'
const PHONE_TEL = 'tel:+14089825456'
const HOURS = 'Mon - Saturday 10AM - 5PM'

const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&t=&z=15&ie=UTF8&iwloc=&output=embed`

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <span id="financing" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />
      <div className={styles.container}>
        <div className={styles.left}>
          <header className={styles.header}>
            <h2 id="contact-title" className={styles.title}>
              Contact Us
            </h2>
            <p className={styles.subtitle}>
              Where we are and when we're open
            </p>
          </header>

          <div className={styles.infoGrid}>
            <div className={styles.block}>
              <span className={styles.label}>Phone</span>
              <a href={PHONE_TEL} className={styles.value}>
                {PHONE}
              </a>
            </div>
            <div className={styles.block}>
              <span className={styles.label}>Working Hours</span>
              <span className={styles.value}>{HOURS}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.label}>Our Address</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.value}
              >
                {ADDRESS}
              </a>
            </div>
          </div>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            src={MAP_EMBED_URL}
            title="A1 Motor Group location map"
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
