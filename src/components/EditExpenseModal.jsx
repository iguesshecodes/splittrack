import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function EditExpenseModal({
  expense,
  members,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || 'General',
    paid_by: expense?.paid_by || '',
    split_type: expense?.split_type || 'equal',
  })

  const [saving, setSaving] = useState(false)
  const [customSplits, setCustomSplits] = useState({})

  useEffect(() => {
    loadSplits()
  }, [])

  const loadSplits = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_splits')
        .select('*')
        .eq('expense_id', expense.id)

      if (error) throw error

      const mapped = {}
      members.forEach((member) => {
        const existing = (data || []).find((split) => String(split.member_id) === String(member.id))
        mapped[member.id] = existing ? existing.amount : ''
      })

      setCustomSplits(mapped)
    } catch (error) {
      console.error('Load splits error:', error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSplitChange = (memberId, value) => {
    setCustomSplits((prev) => ({
      ...prev,
      [memberId]: value,
    }))
  }

  const selectedMember = members.find((m) => String(m.id) === String(form.paid_by))

  const customSplitTotal = useMemo(() => {
    return Object.values(customSplits).reduce((sum, value) => sum + Number(value || 0), 0)
  }, [customSplits])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.amount || !form.paid_by) {
      toast.error('Please complete all required fields')
      return
    }

    const totalAmount = Number(form.amount)

    if (form.split_type === 'custom') {
      if (Math.abs(customSplitTotal - totalAmount) > 0.01) {
        toast.error('Custom split total must match expense amount')
        return
      }
    }

    try {
      setSaving(true)

      const { error } = await supabase
        .from('group_expenses')
        .update({
          title: form.title,
          amount: totalAmount,
          category: form.category,
          paid_by: form.paid_by,
          paid_by_name: selectedMember?.name || selectedMember?.email || 'Unknown',
          split_type: form.split_type,
        })
        .eq('id', expense.id)

      if (error) throw error

      const { error: deleteSplitsError } = await supabase
        .from('expense_splits')
        .delete()
        .eq('expense_id', expense.id)

      if (deleteSplitsError) throw deleteSplitsError

      let splitRows = []

      if (form.split_type === 'equal') {
        const equalAmount = totalAmount / members.length
        splitRows = members.map((member) => ({
          expense_id: expense.id,
          member_id: member.id,
          amount: equalAmount,
        }))
      } else {
        splitRows = members.map((member) => ({
          expense_id: expense.id,
          member_id: member.id,
          amount: Number(customSplits[member.id] || 0),
        }))
      }

      const { error: insertSplitsError } = await supabase
        .from('expense_splits')
        .insert(splitRows)

      if (insertSplitsError) throw insertSplitsError

      toast.success('Expense updated')
      onUpdated?.()
      onClose?.()
    } catch (error) {
      console.error('Edit expense error:', error.message)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <div className="premium-modal-header">
          <div>
            <h2>Edit expense</h2>
            <p>Update title, amount, payer, and split style.</p>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="premium-modal-form" onSubmit={handleSubmit}>
          <div className="premium-field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="premium-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div className="premium-field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Transport">Transport</option>
              <option value="Rent">Rent</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>

          <div className="premium-field">
            <label>Paid by</label>
            <select name="paid_by" value={form.paid_by} onChange={handleChange}>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </div>

          <div className="premium-field premium-field-full">
            <label>Split type</label>
            <select name="split_type" value={form.split_type} onChange={handleChange}>
              <option value="equal">Equal split</option>
              <option value="custom">Custom split</option>
            </select>
          </div>

          {form.split_type === 'custom' && (
            <div className="premium-field premium-field-full">
              <label>Custom amounts per member</label>

              <div className="custom-split-grid">
                {members.map((member) => (
                  <div key={member.id} className="custom-split-row">
                    <span>{member.name || member.email}</span>
                    <input
                      type="number"
                      value={customSplits[member.id] || ''}
                      onChange={(e) => handleSplitChange(member.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="split-note">
                Current split total: £{customSplitTotal.toFixed(2)} / £
                {Number(form.amount || 0).toFixed(2)}
              </div>
            </div>
          )}

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}