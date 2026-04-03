import { useState } from 'react'

const themes = {
  default: {
    name: 'Default',
    accent: '#17392b',
    accent2: '#1f4d3a',
    card: '#ffffff',
    soft: '#f5faf7',
    text: '#111827',
  },
  matcha: {
    name: 'Matcha',
    accent: '#4f7a57',
    accent2: '#7ca36f',
    card: '#ffffff',
    soft: '#f3f9ef',
    text: '#1f2f22',
  },
  plum: {
    name: 'Plum',
    accent: '#5b2a86',
    accent2: '#7c3aed',
    card: '#ffffff',
    soft: '#f7f1fb',
    text: '#22152d',
  },
  sky: {
    name: 'Sky',
    accent: '#2563eb',
    accent2: '#38bdf8',
    card: '#ffffff',
    soft: '#eff7ff',
    text: '#12243a',
  },
  dark: {
    name: 'Dark',
    accent: '#38bdf8',
    accent2: '#2563eb',
    card: '#111827',
    soft: '#0f172a',
    text: '#f8fafc',
  },
}

export default function HomepageThemePreview() {
  const [activeTheme, setActiveTheme] = useState('default')
  const theme = themes[activeTheme]

  return (
    <section className="homepage-theme-section">
      <div className="homepage-theme-grid">
        <div className="homepage-theme-copy">
          <span className="story-label">Theme preview</span>
          <h2>Make money tracking feel more like you.</h2>
          <p>
            SplitTrack lets users personalize the feel of their workspace with softer,
            cleaner, mood-based themes.
          </p>

          <div className="theme-preview-switches">
            {Object.entries(themes).map(([key, item]) => (
              <button
                key={key}
                className={`theme-preview-btn ${activeTheme === key ? 'active' : ''}`}
                onClick={() => setActiveTheme(key)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div
          className="theme-preview-window"
          style={{
            background: theme.card,
            color: theme.text,
            borderColor: theme.soft,
          }}
        >
          <div className="theme-preview-top">
            <span />
            <span />
            <span />
          </div>

          <div className="theme-preview-body">
            <div
              className="theme-preview-balance"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent2} 100%)`,
                color: '#fff',
              }}
            >
              <span>This month</span>
              <strong>£2,640</strong>
              <p>Budget left: £740</p>
            </div>

            <div className="theme-preview-mini-grid">
              <div
                className="theme-preview-mini"
                style={{ background: theme.soft, color: theme.text }}
              >
                <span>Income</span>
                <strong>+£3,100</strong>
              </div>

              <div
                className="theme-preview-mini"
                style={{ background: theme.soft, color: theme.text }}
              >
                <span>Spent</span>
                <strong>-£1,860</strong>
              </div>

              <div
                className="theme-preview-mini wide"
                style={{ background: theme.soft, color: theme.text }}
              >
                <span>Groups</span>
                <strong>03 active splits</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}