import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      toast.error('Please complete all fields')
      return
    }

    try {
      setLoading(true)

      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        })

        if (error) throw error

        toast.success('Account created. You can now log in.')
        setIsSignup(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })

        if (error) throw error

        toast.success('Welcome back ✨')
      }
    } catch (error) {
      console.error('Auth error:', error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page-v2">
      <div className="auth-overlay" />

      <div className="auth-card auth-card-v2">
        <div className="auth-brand">
          <div className="auth-logo">💸</div>
          <div>
            <h1>SplitTrack</h1>
            <p>Money, but calmer and better designed.</p>
          </div>
        </div>

        <div className="auth-header">
          <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p>
            {isSignup
              ? 'Start tracking your spending and splitting money in one clean space.'
              : 'Log in to access your money dashboard, budgets, and shared groups.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? isSignup
                ? 'Creating account...'
                : 'Logging in...'
              : isSignup
              ? 'Create account'
              : 'Log in'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => setIsSignup((prev) => !prev)}>
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>

        <div className="auth-helper-note">
          Built for students, flatmates, trips, dinners, and your everyday money life.
        </div>
      </div>
    </div>
  )
}