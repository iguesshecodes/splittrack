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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (profileError || !profile) {
      setError('No SplitTrack account found for that email. Ask them to sign up first.')
      setLoading(false)
      return
    }

    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: profile.id
      })

    if (memberError) {
      if (memberError.code === '23505') {
        setError('This person is already in the group.')
      } else {
        setError(memberError.message)
      }
      setLoading(false)
      return
    }

    setSuccess(`${profile.name || profile.email} added successfully.`)
    setEmail('')
    setLoading(false)

    setTimeout(() => {
      onAdded()
    }, 900)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="premium-modal">
        <div className="premium-modal-header">
          <div>
            <h2>Add Member</h2>
            <p>Invite someone into this group using the email linked to their SplitTrack account.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-message error">{error}</div>}
        {success && <div className="auth-message success">{success}</div>}

        <form className="premium-modal-form" onSubmit={handleAdd}>
          <div className="premium-field premium-field-full">
            <label>Email address</label>
            <input
              type="email"
              placeholder="friend@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}