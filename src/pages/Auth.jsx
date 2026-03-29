import { useState } from 'react'
import { supabase } from '../lib/supabase'

const Logo = () => (
  <div className="auth-logo">
    <div className="auth-logo-mark">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="10.5" width="7" height="3" rx="1.5" fill="white"/>
        <rect x="14" y="10.5" width="7" height="3" rx="1.5" fill="white"/>
        <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="2"/>
        <rect x="8.5" y="4" width="2.5" height="7" rx="1.25" fill="rgba(255,255,255,0.4)"/>
        <rect x="13" y="13" width="2.5" height="7" rx="1.25" fill="rgba(255,255,255,0.4)"/>
      </svg>
    </div>
    <div className="auth-wordmark">Split<span>Track</span></div>
  </div>
)

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) setError(error.message)
      else setSuccess('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <Logo />
        <div className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
        <div className="auth-sub">{mode === 'login' ? 'Sign in to your account' : 'Start splitting expenses with friends'}</div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="field">
              <label>Your name</label>
              <input type="text" placeholder="Varesh" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }}>Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  )
}
