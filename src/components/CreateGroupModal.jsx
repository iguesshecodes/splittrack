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

    const { data: group, error: gErr } = await supabase
      .from('groups')
      .insert({ name: name.trim(), description: description.trim(), currency, created_by: session.user.id })
      .select()
      .single()

    if (gErr) { setError(gErr.message); setLoading(false); return }

    const { error: mErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: session.user.id })

    if (mErr) { setError(mErr.message); setLoading(false); return }

    setLoading(false)
    onCreated()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Create a group</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Group name</label>
            <input type="text" placeholder="e.g. Goa Trip 2025" value={name} onChange={e => setName(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label>Description (optional)</label>
            <input type="text" placeholder="What's this group for?" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="field">
            <label>Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="£">£ GBP</option>
              <option value="€">€ EUR</option>
              <option value="$">$ USD</option>
              <option value="₹">₹ INR</option>
              <option value="AED">AED</option>
            </select>
          </div>
          <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
