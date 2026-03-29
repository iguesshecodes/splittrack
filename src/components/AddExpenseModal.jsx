import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddExpenseModal({ group, members, session, onClose, onAdded }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(session.user.id)
  const [selectedMembers, setSelectedMembers] = useState(members.map(m => m.user_id))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const currency = group.currency || '£'

  function toggleMember(id) {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function initials(name = '') {
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim() || !amount || selectedMembers.length === 0) return
    setLoading(true)
    setError('')

    const amtNum = parseFloat(parseFloat(amount).toFixed(2))
    const splitAmt = parseFloat((amtNum / selectedMembers.length).toFixed(2))

    const { data: exp, error: eErr } = await supabase
      .from('expenses')
      .insert({
        group_id: group.id,
        description: description.trim(),
        amount: amtNum,
        paid_by: paidBy,
        created_by: session.user.id
      })
      .select()
      .single()

    if (eErr) { setError(eErr.message); setLoading(false); return }

    const splits = selectedMembers.map(uid => ({ expense_id: exp.id, user_id: uid, amount: splitAmt }))
    const { error: sErr } = await supabase.from('expense_splits').insert(splits)

    if (sErr) { setError(sErr.message); setLoading(false); return }

    setLoading(false)
    onAdded()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add expense</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Description</label>
            <input type="text" placeholder="e.g. Dinner at Dishoom" value={description} onChange={e => setDescription(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label>Amount ({currency})</label>
            <input type="number" placeholder="0.00" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div className="field">
            <label>Paid by</label>
            <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
              {members.map(m => (
                <option key={m.user_id} value={m.user_id}>{m.profiles?.name || m.profiles?.email}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Split among</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {members.map(m => {
                const sel = selectedMembers.includes(m.user_id)
                return (
                  <div key={m.user_id} className={`member-check${sel ? ' selected' : ''}`} onClick={() => toggleMember(m.user_id)}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{initials(m.profiles?.name)}</span>
                    {m.profiles?.name}
                  </div>
                )
              })}
            </div>
            {selectedMembers.length > 0 && amount && (
              <div className="text-sm text-muted mt-1">
                {currency}{(parseFloat(amount) / selectedMembers.length).toFixed(2)} each
              </div>
            )}
          </div>
          <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading || selectedMembers.length === 0}>
              {loading ? 'Adding...' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
