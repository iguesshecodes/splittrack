import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PageTransition from '../components/PageTransition'

const faqs = [
  {
    q: 'Is SplitTrack only for group expenses?',
    a: 'No. SplitTrack combines both personal finance tracking and shared expense splitting in one space.',
  },
  {
    q: 'Can I use it for budgeting too?',
    a: 'Yes. You can set monthly budget goals, track spending, and see budget progress.',
  },
  {
    q: 'Is the group split logic equal only?',
    a: 'Right now the MVP focuses on equal split logic, but advanced split styles can be added later.',
  },
  {
    q: 'Who is SplitTrack for?',
    a: 'Students, flatmates, couples, travelers, friends, and anyone who wants a more visual money experience.',
  },
]

export default function FAQ({ session }) {
  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="public-hero">
          <Reveal className="public-hero-inner">
            <span className="story-label">FAQ</span>
            <h1>Questions, answered simply.</h1>
            <p>
              Everything you might want to know about SplitTrack, from budgeting to group
              splitting to the overall product direction.
            </p>
          </Reveal>
        </section>

        <section className="faq-section">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.06}>
              <div className="faq-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}