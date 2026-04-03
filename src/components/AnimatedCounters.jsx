import { useEffect, useState } from 'react'
import Reveal from './Reveal'

function Counter({ target, suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return (
    <strong>
      {count}
      {suffix}
    </strong>
  )
}

export default function AnimatedCounters() {
  return (
    <section className="counters-section">
      <div className="counters-grid">
        <Reveal delay={0.05}>
          <div className="counter-card">
            <span>Expense entries tracked</span>
            <Counter target={1200} suffix="+" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="counter-card">
            <span>Shared payments simplified</span>
            <Counter target={340} suffix="+" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="counter-card">
            <span>Money stress reduced</span>
            <Counter target={87} suffix="%" />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="counter-card">
            <span>Finance vibe improved</span>
            <Counter target={100} suffix="%" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}