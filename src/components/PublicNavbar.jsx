import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function PublicNavbar({
  session,
  light = false,
  showSelectors = false,
  currency = 'GBP',
  language = 'EN',
  setCurrency,
  setLanguage,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [publicTheme, setPublicTheme] = useState(
    localStorage.getItem('splittrack-public-theme') || 'default'
  )

  const navigate = useNavigate()

  useEffect(() => {
    document.body.setAttribute('data-public-theme', publicTheme)
    localStorage.setItem('splittrack-public-theme', publicTheme)
  }, [publicTheme])

  const handleOpen = () => {
    if (session) {
      navigate('/app/dashboard')
    } else {
      navigate('/login')
    }
    setMobileMenuOpen(false)
  }

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <nav className={`nav ${light ? 'nav-v4' : 'public-nav'}`}>
        <div className="nav-logo">
          <Link to="/" className={`nav-logo-link ${light ? 'nav-logo-light' : ''}`}>
            <span className={light ? 'logo-light-accent' : 'logo-green'}>Split</span>Track
          </Link>
        </div>

        <div className={`nav-links ${light ? 'nav-links-light' : ''} nav-desktop-links`}>
          <Link to="/story">Story</Link>
          <Link to="/finance">Finance</Link>
          <Link to="/groups">Groups</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        <div className="nav-controls nav-desktop-controls">
          {showSelectors && setCurrency && setLanguage && (
            <>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`nav-select ${light ? 'nav-select-light' : ''}`}
              >
                <option>GBP</option>
                <option>USD</option>
                <option>EUR</option>
                <option>INR</option>
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`nav-select ${light ? 'nav-select-light' : ''}`}
              >
                <option>EN</option>
                <option>FR</option>
                <option>DE</option>
                <option>ES</option>
              </select>
            </>
          )}

          <select
            value={publicTheme}
            onChange={(e) => setPublicTheme(e.target.value)}
            className={`nav-select ${light ? 'nav-select-light' : ''}`}
          >
            <option value="default">Default Mood</option>
            <option value="peach">Peach Pop</option>
            <option value="lavender">Lavender Rush</option>
            <option value="blue">Blue Fizz</option>
            <option value="matcha">Matcha Milk</option>
            <option value="cherry">Cherry Glow</option>
          </select>

          <button
            type="button"
            className={`nav-login-btn ${light ? 'nav-login-btn-light' : ''}`}
            onClick={handleOpen}
          >
            {session ? 'Open app' : 'Login'}
          </button>
        </div>

        <button
          type="button"
          className={`mobile-menu-btn ${light ? 'mobile-menu-btn-light' : ''}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`mobile-menu ${light ? 'mobile-menu-light' : 'mobile-menu-dark'}`}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <Link to="/story" onClick={closeMenu}>Story</Link>
            <Link to="/finance" onClick={closeMenu}>Finance</Link>
            <Link to="/groups" onClick={closeMenu}>Groups</Link>
            <Link to="/pricing" onClick={closeMenu}>Pricing</Link>

            <select
              className="mobile-theme-select"
              value={publicTheme}
              onChange={(e) => setPublicTheme(e.target.value)}
            >
              <option value="default">Default Mood</option>
              <option value="peach">Peach Pop</option>
              <option value="lavender">Lavender Rush</option>
              <option value="blue">Blue Fizz</option>
              <option value="matcha">Matcha Milk</option>
              <option value="cherry">Cherry Glow</option>
            </select>

            <button type="button" onClick={handleOpen}>
              {session ? 'Open app' : 'Login'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}