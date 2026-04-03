import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PageTransition from '../components/PageTransition'

export default function Pricing({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="public-hero">
          <Reveal className="public-hero-inner">
            <span className="story-label">Pricing</span>
            <h1>Simple plans for personal and shared money.</h1>
            <p>
              Start free, explore SplitTrack, and upgrade later if you want more themes,
              deeper insights, and enhanced group features.
            </p>
          </Reveal>
        </section>

        <section className="pricing-section">
          <Reveal delay={0.05}>
            <div className="pricing-card">
              <span>Free</span>
              <h3>£0</h3>
              <p>Perfect for getting started with personal tracking and shared groups.</p>
              <ul>
                <li>Personal expense tracking</li>
                <li>Budget goal setting</li>
                <li>Create groups</li>
                <li>Basic split balances</li>
              </ul>
              <button className="cta-primary">Start free</button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pricing-card featured">
              <span>Plus</span>
              <h3>£6/mo</h3>
              <p>For users who want a more premium money workspace and deeper visuals.</p>
              <ul>
                <li>Everything in Free</li>
                <li>More themes</li>
                <li>Advanced insights</li>
                <li>Enhanced group tools</li>
              </ul>
              <button className="cta-primary">Coming soon</button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="pricing-card">
              <span>Group Pro</span>
              <h3>£12/mo</h3>
              <p>For shared households, travel groups, and people splitting often.</p>
              <ul>
                <li>Everything in Plus</li>
                <li>Settlement history</li>
                <li>Advanced split logic</li>
                <li>Shared analytics</li>
              </ul>
              <button className="cta-primary">Coming soon</button>
            </div>
          </Reveal>
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}