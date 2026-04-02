import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CreateGroupModal({ session, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('£')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: name.trim(),
        description: description.trim(),
        currency,
        created_by: session.user.id
      })
      .select()
      .single()

    if (groupError) {
      setError(groupError.message)
      setLoading(false)
      return
    }

    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: session.user.id
      })

    if (memberError) {
      setError(memberError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    onCreated()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="premium-modal">
        <div className="premium-modal-header">
          <div>
            <h2>Create Group</h2>
            <p>Start a new shared space for trips, flatmates, dinners, or events.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-message error">{error}</div>}

        <form className="premium-modal-form" onSubmit={handleCreate}>
          <div className="premium-field premium-field-full">
            <label>Group name</label>
            <input
              type="text"
              placeholder="e.g. Goa Trip 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="premium-field premium-field-full">
            <label>Description</label>
            <input
              type="text"
              placeholder="What’s this group for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="premium-field">
            <label>Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="£">£ GBP</option>
              <option value="€">€ EUR</option>
              <option value="$">$ USD</option>
              <option value="₹">₹ INR</option>
              <option value="AED">AED</option>
            </select>
          </div>

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}