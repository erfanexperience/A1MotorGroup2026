import styles from './AboutUsPage.module.css'

const COPY = [
  `For over 20 years, A1 Motor Group has been the trusted name in premium pre-owned vehicles in San Jose and the greater Bay Area. Our journey began with a simple vision: to create a dealership where customers feel valued, respected, and confident in their vehicle purchases. Today, that vision has evolved into a legacy of excellence, serving thousands of satisfied customers throughout Silicon Valley.`,
  `Our commitment to excellence and personalized service has made us a leader in the automotive industry. We understand that each customer's needs are unique, and we take pride in helping every client find the perfect vehicle that matches both their lifestyle and budget. This dedication to personalized service has earned us not just customers, but lifelong friends who trust us with all their automotive needs.`,
  `At the heart of our success is our dedication to building long-lasting relationships with our customers. We believe in transparency, integrity, and going above and beyond to ensure complete satisfaction. Our team takes the time to understand your specific requirements, preferences, and concerns, providing expert guidance throughout your car-buying journey.`,
  `We understand that purchasing a vehicle is more than just a transaction – it's an important life decision that deserves expert guidance and support. That's why we maintain a carefully curated inventory of premium pre-owned vehicles, each thoroughly inspected to meet our rigorous quality standards. Our extensive network in the automotive industry allows us to source the finest vehicles, ensuring our customers have access to the best options available in the market.`,
  `Whether you're buying, selling, or trading, we're here to make the process straightforward and stress-free. Stop by our location on Saratoga Avenue in San Jose, or reach out anytime – we'd love to meet you and show you why so many Bay Area drivers have made A1 Motor Group their go-to choice for over two decades.`,
]

export default function AboutUsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.heroBlock} aria-labelledby="about-title">
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <div className={styles.heroContent}>
              <h1 id="about-title" className={styles.heroTitle}>
                About us
              </h1>
              <p className={styles.heroSubline}>
                Two decades of trust, transparency, and quality in the heart of the Bay Area.
              </p>
              <a href="#about-story" className={styles.cta}>
                Read more about us
              </a>
            </div>
          </div>
          <div className={styles.heroRight}>
            <img
              src="/Assests/about.webp"
              alt="A1 Motor Group – your trusted dealership in San Jose"
              className={styles.heroImage}
              width={800}
              height={533}
            />
          </div>
        </div>
      </section>

      <section id="about-story" className={styles.storySection} aria-labelledby="story-heading">
        <div className={styles.storyContainer}>
          <h2 id="story-heading" className={styles.storyTitle}>
            Our story
          </h2>
          <div className={styles.storyContent}>
            {COPY.map((paragraph, i) => (
              <p key={i} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
