import { useState } from 'react'
import toast from 'react-hot-toast'
import Reveal from './Reveal'

export default function WaitlistCTA() {
  const [email, setEmail] = useState('')

  const handleJoin = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    toast.success('You joined the waitlist ✨')
    setEmail('')
  }

  return (
    <section className="waitlist-section">
      <Reveal className="waitlist-box">
        <span className="story-label">Stay in the loop</span>
        <h2>Join the SplitTrack waitlist.</h2>
        <p>
          Get updates on new features, premium themes, smarter group tools, and future
          launches.
        </p>

        <form className="waitlist-form" onSubmit={handleJoin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="cta-primary">
            Join waitlist
          </button>
        </form>
      </Reveal>
    </section>
  )
}
