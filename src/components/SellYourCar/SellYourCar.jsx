import styles from './SellYourCar.module.css'

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

export default function SellYourCar() {
  return (
    <section
      id="sell-your-car"
      className={styles.section}
      aria-labelledby="sell-title"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 id="sell-title" className={styles.title}>
            Trade in your car
          </h2>
          <p className={styles.body}>
            Get the guaranteed best market value for your vehicle with our
            transparent, no-haggle appraisal process. Skip the hassle of private
            selling and drive away with more cash in your pocket today.
          </p>
          <button
            type="button"
            onClick={scrollToContact}
            className={styles.cta}
          >
            Get Started
          </button>
        </div>
        <div className={styles.imageWrap}>
          <img
            src="/Assests/Sell.webp"
            alt="Trade in your car at A1 Motor Group for best market value"
            width="560"
            height="360"
            loading="lazy"
            decoding="async"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  )
}
