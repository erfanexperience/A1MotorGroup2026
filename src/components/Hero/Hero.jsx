import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.content}>
            <h1 id="hero-title" className={styles.title}>
              Welcome to A1 Motor Group
            </h1>
            <p className={styles.subheadline}>
              Serving the Bay Area with Quality Pre-Owned Vehicles for Over Two Decades
            </p>
            <a href="#inventory" className={styles.cta}>
              Explore Our Inventory
            </a>
          </div>
          <a
            href="#inventory"
            className={styles.scrollHint}
            aria-label="Scroll to inventory"
          >
            <span className={styles.scrollChevron} />
          </a>
        </div>
        <div className={styles.right}>
          <img
            src="/Assests/Hero.webp"
            alt="A1 Motor Group dealership"
            className={styles.heroImage}
            width={1200}
            height={800}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
