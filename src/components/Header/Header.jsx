import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'Inventory', to: '/', hash: '#inventory' },
  { label: 'Apply For Financing', to: '/apply-for-financing' },
  { label: 'Sell Your Car', to: '/sell-your-car' },
  { label: 'About Us', to: '/about-us' },
]

const PHONE = '(408) 982-5456'
const PHONE_TEL = 'tel:+14089825456'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.wrapper}>
        <Link to="/" className={styles.logo} aria-label="A1 Motor Group home">
          <img
            src="/Assests/logo.webp"
            alt="A1 Motor Group"
            width="120"
            height="40"
            loading="eager"
            decoding="async"
          />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, to, hash }) => (
              <li key={to + (hash || '')}>
                {hash ? (
                  <a href={`${to}${hash}`} onClick={closeMenu} className={styles.navLink}>
                    {label}
                  </a>
                ) : (
                  <Link to={to} onClick={closeMenu} className={styles.navLink}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={PHONE_TEL}
          className={styles.phoneCta}
          aria-label={`Call us: ${PHONE}`}
        >
          {PHONE}
        </a>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={styles.hamburger} data-open={menuOpen} />
          <span className={styles.hamburger} data-open={menuOpen} />
          <span className={styles.hamburger} data-open={menuOpen} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuInner}>
          <ul className={styles.mobileNavList}>
            {NAV_LINKS.map(({ label, to, hash }) => (
              <li key={to + (hash || '')}>
                {hash ? (
                  <a href={`${to}${hash}`} onClick={closeMenu} className={styles.mobileNavLink}>
                    {label}
                  </a>
                ) : (
                  <Link to={to} onClick={closeMenu} className={styles.mobileNavLink}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <a
            href={PHONE_TEL}
            className={styles.mobilePhone}
            onClick={closeMenu}
          >
            {PHONE}
          </a>
        </div>
      </div>
    </header>
  )
}
