export default function Home({ onGetStarted }) {
  return (
    <div className="homepage">
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-green">Split</span>Track
        </div>

        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#finance">Finance</a>
          <a href="#groups">Groups</a>
          <button className="nav-login-btn" onClick={onGetStarted}>Login</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>
            Split expenses.<br />
            Track money.<br />
            <span className="highlight">Live smarter.</span>
          </h1>

          <p className="hero-subtitle">
            A premium finance space for flatmates, dinners, trips, and personal budgeting — designed to feel calm, modern, and actually useful.
          </p>

          <div className="hero-buttons">
            <button className="cta-primary" onClick={onGetStarted}>Get started</button>
            <a href="#story" className="cta-secondary">See how it feels</a>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
            alt="SplitTrack premium lifestyle"
          />
        </div>
      </section>

      <div className="trust-bar">
        Built for students, travellers, flatmates, and anyone who wants a cleaner money life.
      </div>

      <section className="showcase-section">
        <div className="showcase-card large">
          <span className="showcase-label">A better way to manage money</span>
          <h3>Personal finance and shared spending — finally in one beautiful flow.</h3>
          <p>
            No chaotic notes, no awkward maths, no ugly spreadsheets. Just a cleaner way to stay on top of your life.
          </p>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-text">
          <span className="story-label">Your money, clearer</span>
          <h2>Track your personal finances without the stress.</h2>
          <p>
            Add income, expenses, and savings in a space that feels intentional and visually calm. Understand your habits, spot patterns, and stay in control.
          </p>
        </div>

        <div className="story-image-card">
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1400&q=80"
            alt="Personal finance aesthetic"
          />
        </div>
      </section>

      <section className="story-section reverse" id="groups">
        <div className="story-text">
          <span className="story-label">Group life, simplified</span>
          <h2>Split dinners, trips, rent, and random moments in seconds.</h2>
          <p>
            Create groups, add expenses, and instantly see who owes what. Whether it’s flatmates, holidays, or just a dinner out, everything stays organised.
          </p>
        </div>

        <div className="story-image-card">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
            alt="Group spending aesthetic"
          />
        </div>
      </section>

      <section className="editorial-strip" id="finance">
        <div className="editorial-block">
          <span>Personal dashboard</span>
          <h3>Track spending with charts, balance cards, and a cleaner transaction flow.</h3>
        </div>

        <div className="editorial-block dark">
          <span>Shared balance</span>
          <h3>Know exactly who paid, who owes, and what’s left to settle.</h3>
        </div>

        <div className="editorial-block soft">
          <span>Designed to feel good</span>
          <h3>Minimal, premium, and built for people who care about clean digital spaces.</h3>
        </div>
      </section>

      <section className="final-cta">
        <h2>Money management should feel lighter.</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Start using SplitTrack and make both personal and shared finances feel clearer.
        </p>
        <button className="cta-primary-big" onClick={onGetStarted}>Get started free</button>
      </section>
    </div>
  )
}