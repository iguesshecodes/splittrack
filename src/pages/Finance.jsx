import PageTransition from '../components/PageTransition'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import Reveal from '../components/Reveal'

export default function Finance({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="editorial-hero">
          <div className="editorial-hero-grid">
            <Reveal className="editorial-hero-copy">
              <span className="story-label">Personal finance</span>
              <h1>Track your money in a more visual, calmer flow.</h1>
              <p>
                SplitTrack helps users monitor daily spending, understand habits, and
                stay on top of budgets through a cleaner dashboard experience.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="editorial-hero-image">
              <img src="/images/finance.jpg" alt="Finance lifestyle" />
            </Reveal>
          </div>
        </section>

        <section className="editorial-showcase">
          <div className="editorial-showcase-grid">
            <Reveal className="editorial-showcase-window">
              <div className="showcase-window-top">
                <span />
                <span />
                <span />
              </div>

              <div className="showcase-window-body">
                <div className="showcase-balance-panel">
                  <div className="showcase-balance-copy">
                    <span>Personal dashboard</span>
                    <strong>£2,640</strong>
                    <p>Budget left this month: £740</p>
                  </div>
                </div>

                <div className="showcase-mini-grid">
                  <div className="showcase-mini-card green">
                    <span>Income</span>
                    <strong>+£3,100</strong>
                  </div>
                  <div className="showcase-mini-card pink">
                    <span>Spent</span>
                    <strong>-£1,860</strong>
                  </div>
                  <div className="showcase-mini-card blue">
                    <span>Charts</span>
                    <strong>Visual insights</strong>
                  </div>
                  <div className="showcase-mini-card cream">
                    <span>Budget</span>
                    <strong>Always visible</strong>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="editorial-showcase-copy">
              <span className="story-label">What it helps with</span>
              <h2>From coffee to rent to subscriptions.</h2>
              <p>
                Track recurring and everyday expenses, compare them against your monthly
                goals, and notice changes in spending patterns without the usual clutter.
              </p>

              <div className="showcase-bullets">
                <div className="showcase-bullet">Expense and income logging</div>
                <div className="showcase-bullet">Budget goals and progress</div>
                <div className="showcase-bullet">Category charts</div>
                <div className="showcase-bullet">Clean personal money dashboard</div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="image-story-band">
          <Reveal className="image-story-band-grid">
            <div className="image-story-band-copy">
              <span className="story-label">Why it feels different</span>
              <h2>Less admin. More awareness.</h2>
              <p>
                SplitTrack was designed to remove friction from personal tracking and
                make budgeting feel more intuitive, visual, and modern.
              </p>
            </div>

            <div className="image-story-band-panel">
              <div className="image-story-stat">
                <span>Track faster</span>
                <strong>Simple entries</strong>
              </div>
              <div className="image-story-stat">
                <span>Understand habits</span>
                <strong>Cleaner charts</strong>
              </div>
              <div className="image-story-stat">
                <span>Stay intentional</span>
                <strong>Budget visibility</strong>
              </div>
            </div>
          </Reveal>
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}