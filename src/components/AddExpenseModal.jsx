import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddExpenseModal({ group, members, session, onClose, onAdded }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(session.user.id)
  const [selectedMembers, setSelectedMembers] = useState(members.map((m) => m.user_id))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currency = group.currency || '£'

  function toggleMember(id) {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function initials(name = '') {
    return name
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!description.trim() || !amount || selectedMembers.length === 0) return

    setLoading(true)
    setError('')

    const amtNum = parseFloat(parseFloat(amount).toFixed(2))
    const splitAmt = parseFloat((amtNum / selectedMembers.length).toFixed(2))

    const { data: expense, error: expenseError } = await supabase
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

    if (expenseError) {
      setError(expenseError.message)
      setLoading(false)
      return
    }

    const splits = selectedMembers.map((uid) => ({
      expense_id: expense.id,
      user_id: uid,
      amount: splitAmt
    }))

    const { error: splitError } = await supabase
      .from('expense_splits')
      .insert(splits)

    if (splitError) {
      setError(splitError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    onAdded()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="premium-modal">
        <div className="premium-modal-header">
          <div>
            <h2>Add Expense</h2>
            <p>Add a new shared expense for this group.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-message error">{error}</div>}

        <form className="premium-modal-form" onSubmit={handleSubmit}>
          <div className="premium-field">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Dinner at Dishoom"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="premium-field">
            <label>Amount ({currency})</label>
            <input
              type="number"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="premium-field">
            <label>Paid by</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.profiles?.name || m.profiles?.email}
                </option>
              ))}
            </select>
          </div>

          <div className="premium-field premium-field-full">
            <label>Split among</label>
            <div className="member-pill-grid">
              {members.map((m) => {
                const selected = selectedMembers.includes(m.user_id)

                return (
                  <button
                    type="button"
                    key={m.user_id}
                    className={`member-pill ${selected ? 'selected' : ''}`}
                    onClick={() => toggleMember(m.user_id)}
                  >
                    <span className="member-pill-avatar">
                      {initials(m.profiles?.name)}
                    </span>
                    <span>{m.profiles?.name || m.profiles?.email}</span>
                  </button>
                )
              })}
            </div>

            {selectedMembers.length > 0 && amount && (
              <div className="split-note">
                {currency}{(parseFloat(amount) / selectedMembers.length).toFixed(2)} each
              </div>
            )}
          </div>

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading || selectedMembers.length === 0}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}