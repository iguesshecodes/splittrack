import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddMemberModal({ group, onClose, onAdded }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (pErr || !profile) {
      setError('No SplitTrack account found for that email. Ask them to sign up first!')
      setLoading(false)
      return
    }

    const { error: mErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: profile.id })

    if (mErr) {
      if (mErr.code === '23505') setError('This person is already in the group.')
      else setError(mErr.message)
      setLoading(false)
      return
    }

    setSuccess(`${profile.name} added successfully!`)
    setEmail('')
    setLoading(false)
    setTimeout(onAdded, 1000)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add a member</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="text-sm text-muted mb-3">
          The person must already have a SplitTrack account. Add them by their email.
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleAdd}>
          <div className="field">
            <label>Their email address</label>
            <input type="email" placeholder="friend@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn btn-outline btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Searching...' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
