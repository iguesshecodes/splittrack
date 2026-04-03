import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const initialForm = {
  title: '',
  amount: '',
  category: 'General',
  paid_by: '',
}

export default function AddExpenseModal({ groupId, members, onClose, onAdded }) {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const selectedMember = members.find((m) => String(m.id) === String(form.paid_by))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.amount || !form.paid_by) {
      toast.error('Please complete all required fields')
      return
    }

    try {
      setSaving(true)

      const payload = {
        group_id: groupId,
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        paid_by: form.paid_by,
        paid_by_name: selectedMember?.name || selectedMember?.email || 'Unknown',
      }

      const { error } = await supabase.from('group_expenses').insert([payload])

      if (error) throw error

      toast.success('Shared expense added')
      onAdded?.()
      onClose?.()
    } catch (error) {
      console.error('Add expense error:', error.message)
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
            <h2>Add a shared expense</h2>
            <p>Record who paid and how much was spent for this group.</p>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="premium-modal-form" onSubmit={handleSubmit}>
          <div className="premium-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Dinner bill"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="premium-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="e.g. 120"
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
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </div>

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Adding...' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}