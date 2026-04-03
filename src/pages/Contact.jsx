import { useState } from 'react'
import toast from 'react-hot-toast'
import Reveal from '../components/Reveal'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PageTransition from '../components/PageTransition'

export default function Contact({ session }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete all fields')
      return
    }

    toast.success('Message sent ✨')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <PageTransition>
      <div className="public-page">
        <PublicNavbar session={session} />

        <section className="public-hero">
          <Reveal className="public-hero-inner">
            <span className="story-label">Contact</span>
            <h1>Let’s talk about money, product, and better digital experiences.</h1>
            <p>
              Got feedback, ideas, questions, or collaboration thoughts? Send a message.
            </p>
          </Reveal>
        </section>

        <section className="contact-section">
          <Reveal className="contact-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
              />

              <textarea
                name="message"
                rows="6"
                placeholder="Your message"
                value={form.message}
                onChange={handleChange}
              />

              <button type="submit" className="cta-primary">
                Send message
              </button>
            </form>
          </Reveal>
        </section>

        <PublicFooter />
      </div>
    </PageTransition>
  )
}