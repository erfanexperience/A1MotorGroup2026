import styles from './AboutUs.module.css'

const COPY = [
  `For over 20 years, A1 Motor Group has been the trusted name in premium pre-owned vehicles in San Jose and the greater Bay Area. Our journey began with a simple vision: to create a dealership where customers feel valued, respected, and confident in their vehicle purchases. Today, that vision has evolved into a legacy of excellence, serving thousands of satisfied customers throughout Silicon Valley.`,
  `Our commitment to excellence and personalized service has made us a leader in the automotive industry. We understand that each customer's needs are unique, and we take pride in helping every client find the perfect vehicle that matches both their lifestyle and budget. This dedication to personalized service has earned us not just customers, but lifelong friends who trust us with all their automotive needs.`,
  `At the heart of our success is our dedication to building long-lasting relationships with our customers. We believe in transparency, integrity, and going above and beyond to ensure complete satisfaction. Our team takes the time to understand your specific requirements, preferences, and concerns, providing expert guidance throughout your car-buying journey.`,
  `We understand that purchasing a vehicle is more than just a transaction – it's an important life decision that deserves expert guidance and support. That's why we maintain a carefully curated inventory of premium pre-owned vehicles, each thoroughly inspected to meet our rigorous quality standards. Our extensive network in the automotive industry allows us to source the finest vehicles, ensuring our customers have access to the best options available in the market.`,
]

export default function AboutUs() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.container}>
        <h2 id="about-title" className={styles.title}>
          About Us
        </h2>
        <div className={styles.content}>
          {COPY.map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
