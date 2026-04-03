import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PageTransition from '../components/PageTransition'
import TestimonialsSection from '../components/TestimonialsSection'

export default function Finance({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="public-hero">
          <Reveal className="public-hero-inner">
            <span className="story-label">Personal finance</span>
            <h1>Track money in a way that feels clean, visual, and easy.</h1>
            <p>
              SplitTrack helps you understand where your money goes, how your habits are
              shifting, and how to stay more intentional without overcomplicating your
              daily life.
            </p>
          </Reveal>
        </section>

        <section className="public-showcase-section">
          <Reveal className="public-showcase-window">
            <div className="public-showcase-top">
              <span />
              <span />
              <span />
            </div>

            <div className="public-showcase-body">
              <div className="public-showcase-balance">
                <span>Monthly overview</span>
                <strong>£2,480</strong>
                <p>Spending tracked beautifully across categories and trends.</p>
              </div>

              <div className="public-showcase-cards">
                <div className="mini-product-card green">
                  <span>Income</span>
                  <strong>+£3,100</strong>
                </div>

                <div className="mini-product-card pink">
                  <span>Spent</span>
                  <strong>-£1,980</strong>
                </div>

                <div className="mini-product-card blue">
                  <span>Budget left</span>
                  <strong>£620</strong>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="public-feature-grid">
          <Reveal delay={0.05}>
            <div className="public-feature-card">
              <span>Tracking</span>
              <h3>Log daily spending fast.</h3>
              <p>
                Add expenses and income without friction, then keep everything organised in
                one place.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="public-feature-card">
              <span>Awareness</span>
              <h3>Understand your habits better.</h3>
              <p>
                View totals, categories, and patterns in a cleaner format that helps you
                notice what matters.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="public-feature-card large">
              <span>Clarity</span>
              <h3>Budget without turning life into admin.</h3>
              <p>
                SplitTrack is designed to support money awareness while keeping the
                experience light and modern.
              </p>
            </div>
          </Reveal>
        </section>

        <TestimonialsSection />
        <PublicFooter />
      </div>
    </PageTransition>
  )
}