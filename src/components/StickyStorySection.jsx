import Reveal from './Reveal'

const storyItems = [
  {
    step: '01',
    title: 'Track your own money with less noise',
    text: 'Add daily expenses, income, categories, and monthly budget goals in one clean workspace.',
    tone: 'green',
  },
  {
    step: '02',
    title: 'Split shared costs without weird mental maths',
    text: 'Create groups, add members, log shared expenses, and see who owes whom instantly.',
    tone: 'blue',
  },
  {
    step: '03',
    title: 'Understand the bigger picture',
    text: 'Use modern charts, progress bars, summaries, and calmer visual structure to stay aware.',
    tone: 'pink',
  },
]

export default function StickyStorySection() {
  return (
    <section className="sticky-story-section">
      <div className="sticky-story-grid">
        <div className="sticky-story-left">
          <div className="sticky-story-copy">
            <span className="story-label">How SplitTrack works</span>
            <h2>
              A softer way
              <br />
              to understand
              <br />
              your money.
            </h2>
            <p>
              SplitTrack combines personal finance and shared finance into one premium
              flow — designed to feel easier to use and easier to come back to.
            </p>
          </div>
        </div>

        <div className="sticky-story-right">
          {storyItems.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.06}>
              <div className={`sticky-story-card ${item.tone}`}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}