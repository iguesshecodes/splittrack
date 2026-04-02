import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        })

        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg('Account created successfully. You can now sign in.')
          setIsSignUp(false)
          setPassword('')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          setErrorMsg(error.message)
        }
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="10.5" width="7" height="3" rx="1.5" fill="white" />
              <rect x="14" y="10.5" width="7" height="3" rx="1.5" fill="white" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1>SplitTrack</h1>
            <p>Shared expenses and personal finance, in one clean space.</p>
          </div>
        </div>

        <div className="auth-header">
          <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
          <p>
            {isSignUp
              ? 'Start managing personal and shared money with a calmer, cleaner experience.'
              : 'Sign in to continue to your financial dashboard.'}
          </p>
        </div>

        {errorMsg && <div className="auth-message error">{errorMsg}</div>}
        {successMsg && <div className="auth-message success">{successMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="auth-field">
              <label>Your name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMsg('')
              setSuccessMsg('')
            }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  )
}