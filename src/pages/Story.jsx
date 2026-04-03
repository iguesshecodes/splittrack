import PageTransition from '../components/PageTransition'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import Reveal from '../components/Reveal'

export default function Story({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="editorial-hero">
          <div className="editorial-hero-grid">
            <Reveal className="editorial-hero-copy">
              <span className="story-label">Our story</span>
              <h1>SplitTrack started with one simple thought: money tools can feel better.</h1>
              <p>
                Most finance products solve the functional side of money but ignore the
                emotional and visual side. SplitTrack was designed to bridge both.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="editorial-hero-image">
              <img src="/images/hero.jpg" alt="Story lifestyle" />
            </Reveal>
          </div>
        </section>

        <section className="editorial-story-section">
          <Reveal className="editorial-story-block">
            <span className="story-label">What we noticed</span>
            <h2>Expense tracking felt cold. Split apps felt transactional.</h2>
            <p>
              The problem wasn’t just utility — it was experience. We wanted to create
              something that could still be trusted, but felt more intuitive, personal,
              and enjoyable.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="editorial-story-grid">
            <div className="editorial-story-card">
              <h3>Useful first</h3>
              <p>Real product logic, real data flows, and real shared expense handling.</p>
            </div>

            <div className="editorial-story-card">
              <h3>Design matters</h3>
              <p>Better hierarchy and visual rhythm create confidence and clarity.</p>
            </div>

            <div className="editorial-story-card">
              <h3>Built for real life</h3>
              <p>Students, flatmates, trips, dinner groups, and everyday personal budgets.</p>
            </div>
          </Reveal>
        </section>

        <section className="image-story-band">
          <Reveal className="image-story-band-grid">
            <div className="image-story-band-copy">
              <span className="story-label">The vibe</span>
              <h2>Playful. Premium. Calm. Useful.</h2>
              <p>
                SplitTrack sits in the space between clean product design and a more
                expressive, modern digital identity.
              </p>
            </div>

            <div className="image-story-band-panel">
              <div className="image-story-stat">
                <span>Not boring</span>
                <strong>Finance with personality</strong>
              </div>
              <div className="image-story-stat">
                <span>Not chaotic</span>
                <strong>Still clean and focused</strong>
              </div>
              <div className="image-story-stat">
                <span>Not just visual</span>
                <strong>Backed by working product logic</strong>
              </div>
            </div>
          </Reveal>
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}