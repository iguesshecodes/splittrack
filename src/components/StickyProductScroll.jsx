import Reveal from './Reveal'

const sections = [
  {
    label: 'Track',
    title: 'Track your own money without the clutter.',
    text: 'Log spending, income, and categories in one soft, organized space that feels easier to use every day.',
    stat: '£2,480',
    meta: 'Monthly tracked spending',
    tone: 'green',
  },
  {
    label: 'Budget',
    title: 'See your budget move in real time.',
    text: 'Understand how much is left, what patterns are emerging, and where your money is shifting visually.',
    stat: '74%',
    meta: 'Budget used this month',
    tone: 'blue',
  },
  {
    label: 'Split',
    title: 'Handle shared expenses more calmly.',
    text: 'Create groups, add members, log expenses, and reduce friction around shared costs with better balance visibility.',
    stat: '4',
    meta: 'Active shared groups',
    tone: 'pink',
  },
]

export default function StickyProductScroll() {
  return (
    <section className="sticky-product-scroll-section">
      <div className="sticky-product-scroll-grid">
        <div className="sticky-product-scroll-left">
          <div className="sticky-product-scroll-copy">
            <span className="story-label">Product walkthrough</span>
            <h2>
              One smooth
              <br />
              flow for
              <br />
              your money.
            </h2>
            <p>
              SplitTrack is designed to feel like a connected product experience — not
              just a collection of pages. Track, budget, and split in one cleaner flow.
            </p>

            <div className="sticky-product-visual-card">
              <img src="/images/finance.jpg" alt="SplitTrack finance visual" />
            </div>
          </div>
        </div>

        <div className="sticky-product-scroll-right">
          {sections.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08}>
              <div className={`sticky-product-panel ${item.tone}`}>
                <div className="sticky-product-panel-top">
                  <span>{item.label}</span>
                  <strong>{item.stat}</strong>
                </div>

                <div className="sticky-product-panel-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="sticky-product-meta">{item.meta}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}