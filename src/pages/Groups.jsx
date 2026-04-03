import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PageTransition from '../components/PageTransition'
import TestimonialsSection from '../components/TestimonialsSection'

export default function Groups({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="public-hero">
          <Reveal className="public-hero-inner">
            <span className="story-label">Shared money</span>
            <h1>Split shared expenses without the awkwardness.</h1>
            <p>
              From flat bills to dinners to trips, SplitTrack helps groups track spending,
              balances, and settlements in a way that feels much more organised.
            </p>
          </Reveal>
        </section>

        <section className="public-feature-grid">
          <Reveal delay={0.05}>
            <div className="public-feature-card large">
              <span>Create groups</span>
              <h3>Build spaces for every shared spending situation.</h3>
              <p>
                Flatmates, vacations, dinner clubs, events, shared monthly costs — each
                group gets its own cleaner money space.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="public-feature-card">
              <span>Add expenses</span>
              <h3>See who paid and how much.</h3>
              <p>
                Record shared spending clearly and keep the group flow easier to follow.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="public-feature-card">
              <span>Settle better</span>
              <h3>Know who owes whom.</h3>
              <p>
                Make group money less confusing with simple balance visibility and cleaner
                settlement logic.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="public-editorial-section">
          <Reveal className="public-editorial-copy">
            <span className="story-label">Why it matters</span>
            <h2>Group money should not become friendship admin.</h2>
            <p>
              Shared expenses are one of those everyday friction points that build up fast.
              SplitTrack helps make them visible, organised, and much easier to resolve.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="public-editorial-panel">
            <div className="public-editorial-line">
              <strong>Dinners</strong>
              <span>Keep one-off social spending from becoming messy follow-up.</span>
            </div>
            <div className="public-editorial-line">
              <strong>Trips</strong>
              <span>Track transport, stays, food, and bookings together.</span>
            </div>
            <div className="public-editorial-line">
              <strong>Flat life</strong>
              <span>Handle rent, groceries, bills, and shared basics with less friction.</span>
            </div>
          </Reveal>
        </section>

        <TestimonialsSection />
        <PublicFooter />
      </div>
    </PageTransition>
  )
}