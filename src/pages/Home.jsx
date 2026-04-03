import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PublicNavbar from '../components/PublicNavbar'
import StickyProductScroll from '../components/StickyProductScroll'
import HomepageThemePreview from '../components/HomepageThemePreview'
import AnimatedCounters from '../components/AnimatedCounters'
import ProductComparisonSection from '../components/ProductComparisonSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WaitlistCTA from '../components/WaitlistCTA'
import PublicFooter from '../components/PublicFooter'
import Reveal from '../components/Reveal'
import './home.css'

const heroText = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function Home({ session }) {
  const [currency, setCurrency] = useState('GBP')
  const [language, setLanguage] = useState('EN')
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (session) {
      navigate('/app/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="homepage homepage-v4 homepage-animated">
      <PublicNavbar
        session={session}
        light
        showSelectors
        currency={currency}
        language={language}
        setCurrency={setCurrency}
        setLanguage={setLanguage}
      />

      <section className="hero-stable">
        <div className="hero-stable-bg">
          <img src="/images/hero.jpg" alt="SplitTrack hero lifestyle" />
          <div className="hero-stable-overlay" />
        </div>

        <div className="hero-stable-inner">
          <motion.div
            className="hero-stable-copy"
            variants={heroText}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-stable-tag" variants={heroItem}>
              Money, but make it lighter.
            </motion.div>

            <motion.h1 variants={heroItem}>
              Split smart.
              <br />
              Track better.
              <br />
              <span>Live softer.</span>
            </motion.h1>

            <motion.p variants={heroItem}>
              SplitTrack brings together personal budgets, shared expenses, and calmer
              money habits in one playful premium space built for real life.
            </motion.p>

            <motion.div className="hero-buttons" variants={heroItem}>
              <button className="cta-dark-pill" onClick={handleGetStarted}>
                Get started
              </button>
              <Link to="/finance" className="cta-light-pill">
                Explore product
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-stable-frame"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <img src="/images/hero.jpg" alt="SplitTrack campaign visual" />

            <div className="hero-stable-outline" />

            <motion.div
              className="hero-stable-ui-card hero-stable-ui-main"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Personal</span>
              <strong>£6,012</strong>
              <button>Accounts</button>
            </motion.div>

            <motion.div
              className="hero-stable-ui-card hero-stable-ui-bottom"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="hero-stable-ui-badge">Budget protected</div>
              <div className="hero-stable-ui-badge">Split balance clean</div>
            </motion.div>

            <motion.div
              className="hero-stable-float hero-stable-float-left"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Currency</span>
              <strong>{currency}</strong>
            </motion.div>

            <motion.div
              className="hero-stable-float hero-stable-float-right"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Language</span>
              <strong>{language}</strong>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="marquee-section">
        <div className="marquee-track">
          <span>split smarter ✦</span>
          <span>track beautifully ✦</span>
          <span>budget easier ✦</span>
          <span>group money, calmer ✦</span>
          <span>less awkward settling ✦</span>
          <span>split smarter ✦</span>
          <span>track beautifully ✦</span>
          <span>budget easier ✦</span>
        </div>
      </section>

      <StickyProductScroll />
      <HomepageThemePreview />
      <AnimatedCounters />
      <ProductComparisonSection />
      <TestimonialsSection />
      <WaitlistCTA />

      <section className="statement-section">
        <Reveal delay={0.05}>
          <div className="statement-card image">
            <img src="/images/group.jpg" alt="Group lifestyle" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="statement-card dark statement-card-copy">
            <span>Built for real life</span>
            <h2>
              Trips. Rent.
              <br />
              Dinners.
              <br />
              Everyday chaos.
            </h2>
            <p>
              From shared groceries to trip bookings to random late-night food orders,
              SplitTrack keeps group money from becoming friendship admin.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="editorial-points">
        <Reveal delay={0.05}>
          <div className="editorial-point product-card-hover">
            <span>01</span>
            <h3>Cleaner charts</h3>
            <p>Understand your money through visuals that feel modern and easy.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="editorial-point product-card-hover">
            <span>02</span>
            <h3>Smoother group splitting</h3>
            <p>Track shared spending without awkward manual calculations.</p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="editorial-point product-card-hover">
            <span>03</span>
            <h3>Playful, but premium</h3>
            <p>A softer digital experience designed to feel cool, calm, and useful.</p>
          </div>
        </Reveal>
      </section>

      <section className="final-cta final-cta-v2">
        <Reveal>
          <motion.div
            className="final-cta-box"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.25 }}
          >
            <span className="story-label">Start now</span>
            <h2>Money management should feel lighter.</h2>
            <p>
              SplitTrack helps you track your own spending, split costs with your
              people, and stay more in control — without ugly tools or mental overload.
            </p>
            <button className="cta-primary-big" onClick={handleGetStarted}>
              Get started free
            </button>
          </motion.div>
        </Reveal>
      </section>

      <PublicFooter />
    </div>
  )
}