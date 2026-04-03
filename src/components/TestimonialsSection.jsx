import Reveal from './Reveal'

const testimonials = [
  {
    name: 'Aisha',
    role: 'Flatmate + student',
    text: 'Finally something that makes split bills and personal expenses feel organised instead of stressful.',
  },
  {
    name: 'Rafi',
    role: 'Trip planner',
    text: 'The group flow feels much cleaner than trying to remember who paid for what on a trip.',
  },
  {
    name: 'Nina',
    role: 'Budgeting beginner',
    text: 'It feels more visual and less intimidating than most finance tools I’ve tried.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <Reveal className="testimonials-intro">
        <span className="story-label">Loved by everyday people</span>
        <h2>Built for real life, not finance robots.</h2>
      </Reveal>

      <div className="testimonials-grid">
        {testimonials.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.08}>
            <div className="testimonial-card">
              <p>“{item.text}”</p>
              <div className="testimonial-meta">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}