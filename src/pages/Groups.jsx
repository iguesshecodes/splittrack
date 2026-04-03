import PageTransition from '../components/PageTransition'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import Reveal from '../components/Reveal'

export default function Groups({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="editorial-hero">
          <div className="editorial-hero-grid reverse-mobile">
            <Reveal className="editorial-hero-copy">
              <span className="story-label">Shared expenses</span>
              <h1>Split shared money in a way that feels clearer and kinder.</h1>
              <p>
                Whether it’s rent, travel, groceries, dinners, or random group costs,
                SplitTrack helps users see who paid, who owes, and how to settle.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="editorial-hero-image">
              <img src="/images/group.jpg" alt="Groups lifestyle" />
            </Reveal>
          </div>
        </section>

        <section className="editorial-showcase">
          <div className="editorial-showcase-grid">
            <Reveal className="editorial-showcase-copy">
              <span className="story-label">Shared money, organised</span>
              <h2>Everything in one visible group flow.</h2>
              <p>
                Add members, create shared expenses, choose equal or custom split logic,
                and keep balances visible without awkward mental math.
              </p>

              <div className="showcase-bullets">
                <div className="showcase-bullet">Create groups for trips or flat life</div>
                <div className="showcase-bullet">Track shared expenses clearly</div>
                <div className="showcase-bullet">See balance summaries</div>
                <div className="showcase-bullet">Mark settlements and reduce confusion</div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="editorial-showcase-window">
              <div className="showcase-window-top">
                <span />
                <span />
                <span />
              </div>

              <div className="showcase-window-body">
                <div className="showcase-balance-panel">
                  <div className="showcase-balance-copy">
                    <span>Group overview</span>
                    <strong>£480</strong>
                    <p>Total spent across 3 people</p>
                  </div>
                </div>

                <div className="showcase-mini-grid">
                  <div className="showcase-mini-card green">
                    <span>Members</span>
                    <strong>03 active</strong>
                  </div>
                  <div className="showcase-mini-card pink">
                    <span>Expenses</span>
                    <strong>06 tracked</strong>
                  </div>
                  <div className="showcase-mini-card blue">
                    <span>Split style</span>
                    <strong>Equal + custom</strong>
                  </div>
                  <div className="showcase-mini-card cream">
                    <span>Settlements</span>
                    <strong>Clear and visible</strong>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="image-story-band">
          <Reveal className="image-story-band-grid">
            <div className="image-story-band-copy">
              <span className="story-label">Who it’s useful for</span>
              <h2>Flatmates. Trips. Dinners. Everyday chaos.</h2>
              <p>
                Shared expenses build up fast. SplitTrack makes them easier to track,
                easier to understand, and easier to settle.
              </p>
            </div>

            <div className="image-story-band-panel">
              <div className="image-story-stat">
                <span>Trips</span>
                <strong>Bookings, food, transport</strong>
              </div>
              <div className="image-story-stat">
                <span>Flat bills</span>
                <strong>Rent, WiFi, groceries</strong>
              </div>
              <div className="image-story-stat">
                <span>Social plans</span>
                <strong>Dinners, outings, gifts</strong>
              </div>
            </div>
          </Reveal>
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}