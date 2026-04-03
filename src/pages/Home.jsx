import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import StickyStorySection from '../components/StickyStorySection'
import AnimatedCounters from '../components/AnimatedCounters'
import ProductComparisonSection from '../components/ProductComparisonSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WaitlistCTA from '../components/WaitlistCTA'
import PublicFooter from '../components/PublicFooter'

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

      <section className="hero-revolut">
        <div className="hero-revolut-bg">
          <img src="/images/hero.jpg" alt="SplitTrack hero lifestyle" />
          <div className="hero-revolut-overlay" />
        </div>

        <div className="hero-revolut-inner">
          <motion.div
            className="hero-revolut-copy"
            variants={heroText}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-revolut-tag" variants={heroItem}>
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
            className="hero-revolut-frame"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            <motion.img
              src="/images/hero.jpg"
              alt="SplitTrack campaign visual"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="frame-outline" />

            <motion.div
              className="hero-ui-card hero-ui-main"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Personal</span>
              <strong>£6,012</strong>
              <button>Accounts</button>
            </motion.div>

            <motion.div
              className="hero-ui-card hero-ui-bottom"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="hero-ui-badge">Budget protected</div>
              <div className="hero-ui-badge">Split balance clean</div>
            </motion.div>

            <motion.div
              className="hero-ui-float hero-ui-float-left"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>Currency</span>
              <strong>{currency}</strong>
            </motion.div>

            <motion.div
              className="hero-ui-float hero-ui-float-right"
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
          <span>group money, calmer ✦</span>
        </div>
      </section>

      <StickyStorySection />

      <section className="product-story-section">
        <Reveal className="product-story-intro">
          <span className="story-label">A better flow</span>
          <h2>
            One home for
            <br />
            your money life.
          </h2>
          <p>
            Personal finance and shared finance usually live in separate messy tools.
            SplitTrack brings them together in one cleaner experience.
          </p>
        </Reveal>

        <div className="product-story-grid">
          <Reveal delay={0.05}>
            <div className="product-story-card large-card product-card-hover">
              <span>Track</span>
              <h3>See your spending clearly.</h3>
              <p>
                Log daily expenses, monitor categories, and build better financial
                awareness without spreadsheet fatigue.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="product-story-card product-card-hover">
              <span>Budget</span>
              <h3>Stay aware, not overwhelmed.</h3>
              <p>Follow your money with calmer summaries and better visual rhythm.</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="product-story-card product-card-hover">
              <span>Split</span>
              <h3>Handle shared costs better.</h3>
              <p>Track who paid, who owes, and what needs settling in one space.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sticky-showcase-section">
        <div className="sticky-showcase-grid">
          <Reveal className="sticky-showcase-copy">
            <span className="story-label">Product showcase</span>
            <h2>Finance tools should feel modern, visual, and human.</h2>
            <p>
              SplitTrack is designed for people who want clarity without clutter —
              easier tracking, cleaner dashboards, and smoother split experiences.
            </p>

            <div className="showcase-bullets">
              <div className="showcase-bullet">Aesthetic spending charts</div>
              <div className="showcase-bullet">Simplified split balances</div>
              <div className="showcase-bullet">Premium dashboard layouts</div>
              <div className="showcase-bullet">Theme-ready personal workspace</div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="sticky-showcase-visual">
            <motion.div
              className="showcase-mockup-window"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25 }}
            >
              <div className="showcase-window-top">
                <span />
                <span />
                <span />
              </div>

              <div className="showcase-window-body">
                <div className="showcase-balance-panel">
                  <div className="showcase-balance-copy">
                    <span>Total balance</span>
                    <strong>£4,280</strong>
                    <p>Budget left this month: £920</p>
                  </div>
                </div>

                <div className="showcase-mini-grid">
                  <div className="showcase-mini-card green">
                    <span>Income</span>
                    <strong>+£3,200</strong>
                  </div>

                  <div className="showcase-mini-card pink">
                    <span>Spent</span>
                    <strong>-£1,840</strong>
                  </div>

                  <div className="showcase-mini-card blue">
                    <span>Groups</span>
                    <strong>04 active</strong>
                  </div>

                  <div className="showcase-mini-card cream">
                    <span>Settlements</span>
                    <strong>02 pending</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      <section className="money-world">
        <Reveal className="money-world-intro">
          <span className="story-label">One product, two worlds</span>
          <h2>
            Personal finance
            <br />
            and shared finance
            <br />
            in one flow.
          </h2>
        </Reveal>

        <div className="money-world-grid">
          <Reveal delay={0.1}>
            <div className="money-world-card light tilt-card">
              <span>Personal space</span>
              <h3>Track spending, budgets, and patterns in a softer dashboard.</h3>
              <p>
                Log your money quickly, understand habits, and keep your budget visible
                without making finance feel heavy.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="money-world-card dark tilt-card">
              <span>Shared space</span>
              <h3>Split costs with flatmates, friends, travel groups, and more.</h3>
              <p>
                Add expenses, track balances, and see exactly who owes what in a much
                cleaner way.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="use-case-section">
        <Reveal className="use-case-intro">
          <span className="story-label">Built for everyday people</span>
          <h2>From flat life to travel chaos.</h2>
        </Reveal>

        <div className="use-case-grid">
          <Reveal delay={0.05}>
            <div className="use-case-card product-card-hover">
              <h3>Flatmates</h3>
              <p>Track rent, groceries, utilities, and shared monthly costs.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="use-case-card product-card-hover">
              <h3>Trips</h3>
              <p>Handle bookings, transport, meals, and all the random spend in between.</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="use-case-card product-card-hover">
              <h3>Friends</h3>
              <p>For dinners, coffee runs, birthdays, and social plans that add up fast.</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="use-case-card product-card-hover">
              <h3>Personal growth</h3>
              <p>Build money awareness and budgeting habits with less friction.</p>
            </div>
          </Reveal>
        </div>
      </section>

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