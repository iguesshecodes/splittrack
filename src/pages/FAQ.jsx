import PageTransition from '../components/PageTransition'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import Reveal from '../components/Reveal'

const faqs = [
  {
    q: 'Is SplitTrack only for group expenses?',
    a: 'No. SplitTrack combines both personal finance tracking and shared expense splitting in one space.',
  },
  {
    q: 'Can I use it for budgeting too?',
    a: 'Yes. You can set monthly budget goals, track spending, and see budget progress with charts and summaries.',
  },
  {
    q: 'Does SplitTrack support custom split logic?',
    a: 'Yes. Shared expenses can be split equally or with custom member-wise amounts.',
  },
  {
    q: 'Who is SplitTrack made for?',
    a: 'Students, flatmates, couples, travelers, friends, and anyone who wants a more visual and modern money experience.',
  },
]

export default function FAQ({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="editorial-hero">
          <div className="editorial-hero-grid reverse-mobile">
            <Reveal className="editorial-hero-copy">
              <span className="story-label">FAQ</span>
              <h1>Questions, answered in a simpler way.</h1>
              <p>
                Here are some of the most common questions about SplitTrack, from
                budgeting to group features to how the experience works.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="editorial-hero-image">
              <img src="/images/group.jpg" alt="FAQ visual" />
            </Reveal>
          </div>
        </section>

        <section className="editorial-story-section">
          <Reveal className="editorial-story-block">
            <span className="story-label">Common questions</span>
            <h2>Everything you’d want to know before trying it.</h2>
          </Reveal>

          <div className="faq-section">
            {faqs.map((item, index) => (
              <Reveal key={item.q} delay={index * 0.06}>
                <div className="faq-card">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}