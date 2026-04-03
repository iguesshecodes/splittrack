import { useState } from 'react'
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
  const navigate = useNavigate()

  const handleOpen = () => {
    if (session) {
      navigate('/app/dashboard')
    } else {
      navigate('/login')
    }
    setMobileMenuOpen(false)
  }

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

          <button
            className={`nav-login-btn ${light ? 'nav-login-btn-light' : ''}`}
            onClick={handleOpen}
          >
            {session ? 'Open app' : 'Login'}
          </button>
        </div>

        <button
          className={`mobile-menu-btn ${light ? 'mobile-menu-btn-light' : ''}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
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
            <Link to="/story" onClick={() => setMobileMenuOpen(false)}>
              Story
            </Link>
            <Link to="/finance" onClick={() => setMobileMenuOpen(false)}>
              Finance
            </Link>
            <Link to="/groups" onClick={() => setMobileMenuOpen(false)}>
              Groups
            </Link>

            <button onClick={handleOpen}>
              {session ? 'Open app' : 'Login'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}