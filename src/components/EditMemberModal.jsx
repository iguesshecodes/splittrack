import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function EditMemberModal({ member, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    email: member?.email || '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Please enter a member name')
      return
    }

    try {
      setSaving(true)

      const { error } = await supabase
        .from('group_members')
        .update({
          name: form.name,
          email: form.email,
        })
        .eq('id', member.id)

      if (error) throw error

      toast.success('Member updated')
      onUpdated?.()
      onClose?.()
    } catch (error) {
      console.error('Edit member error:', error.message)
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
            <h2>Edit member</h2>
            <p>Update this member’s details.</p>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="premium-modal-form" onSubmit={handleSubmit}>
          <div className="premium-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="premium-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

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
