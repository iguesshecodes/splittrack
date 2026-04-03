import PageTransition from '../components/PageTransition'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import Reveal from '../components/Reveal'
import WaitlistCTA from '../components/WaitlistCTA'

export default function Pricing({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="editorial-hero">
          <div className="editorial-hero-grid">
            <Reveal className="editorial-hero-copy">
              <span className="story-label">Pricing</span>
              <h1>Simple plans for personal and shared money.</h1>
              <p>
                Start with the core SplitTrack experience and imagine where premium
                features like advanced insights, more themes, and richer group tools can go.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="editorial-hero-image">
              <img src="/images/finance.jpg" alt="Pricing visual" />
            </Reveal>
          </div>
        </section>

        <section className="pricing-section">
          <Reveal delay={0.05}>
            <div className="pricing-card">
              <span>Free</span>
              <h3>£0</h3>
              <p>Great for getting started with your personal and shared money flow.</p>
              <ul>
                <li>Personal expense tracking</li>
                <li>Monthly budget setting</li>
                <li>Create groups</li>
                <li>Equal + custom split support</li>
              </ul>
              <button className="cta-primary">Start free</button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pricing-card featured">
              <span>Plus</span>
              <h3>£6/mo</h3>
              <p>For users who want a more premium workspace and deeper insights.</p>
              <ul>
                <li>Everything in Free</li>
                <li>More themes</li>
                <li>Advanced visual summaries</li>
                <li>Enhanced group tools</li>
              </ul>
              <button className="cta-primary">Coming soon</button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="pricing-card">
              <span>Group Pro</span>
              <h3>£12/mo</h3>
              <p>For frequent split use, bigger groups, and deeper settlement workflows.</p>
              <ul>
                <li>Everything in Plus</li>
                <li>Settlement history tools</li>
                <li>Group analytics</li>
                <li>Advanced split experiences</li>
              </ul>
              <button className="cta-primary">Coming soon</button>
            </div>
          </Reveal>
        </section>

        <WaitlistCTA />
        <PublicFooter />
      </div>
    </PageTransition>
  )
}