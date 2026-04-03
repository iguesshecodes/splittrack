import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PageTransition from '../components/PageTransition'
import TestimonialsSection from '../components/TestimonialsSection'

export default function Story({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="public-hero">
          <Reveal className="public-hero-inner">
            <span className="story-label">Our story</span>
            <h1>Finance tools should feel less cold and more human.</h1>
            <p>
              SplitTrack was created around one simple idea: money management should be
              easier to understand, softer to use, and better designed for real modern
              life.
            </p>
          </Reveal>
        </section>

        <section className="public-feature-grid">
          <Reveal delay={0.05}>
            <div className="public-feature-card large">
              <span>Why it exists</span>
              <h3>Because most money apps still feel too heavy.</h3>
              <p>
                Traditional finance tools focus on raw utility but often ignore how people
                actually feel while using them. SplitTrack is designed to reduce that
                stress.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="public-feature-card">
              <span>What we believe</span>
              <h3>Clarity is a feature.</h3>
              <p>
                Better layout, better spacing, better summaries, and better flows can make
                people feel more in control of their money.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="public-feature-card">
              <span>Who it’s for</span>
              <h3>Students, flatmates, couples, friends, and everyday people.</h3>
              <p>
                Anyone balancing personal spending and shared expenses deserves something
                cleaner and calmer.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="public-editorial-section">
          <Reveal className="public-editorial-copy">
            <span className="story-label">The SplitTrack mindset</span>
            <h2>Useful enough to trust. Soft enough to enjoy.</h2>
            <p>
              We want SplitTrack to sit between utility and identity — a product that
              helps with financial organisation, but also feels contemporary, personal, and
              visually expressive.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="public-editorial-panel">
            <div className="public-editorial-line">
              <strong>Less clutter</strong>
              <span>More breathing room in every interaction.</span>
            </div>
            <div className="public-editorial-line">
              <strong>Less stress</strong>
              <span>More confidence when tracking and splitting.</span>
            </div>
            <div className="public-editorial-line">
              <strong>Less boring design</strong>
              <span>More premium personality in the product experience.</span>
            </div>
          </Reveal>
        </section>

        <TestimonialsSection />
        <PublicFooter />
      </div>
    </PageTransition>
  )
}