import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const initialForm = {
  name: '',
  email: '',
}

export default function AddMemberModal({ groupId, onClose, onAdded }) {
  const [form, setForm] = useState(initialForm)
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

      const payload = {
        group_id: groupId,
        name: form.name,
        email: form.email,
      }

      const { error } = await supabase.from('group_members').insert([payload])

      if (error) throw error

      toast.success('Member added successfully')
      onAdded?.()
      onClose?.()
    } catch (error) {
      console.error('Add member error:', error.message)
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
            <h2>Add a member</h2>
            <p>Add someone to this shared expense group.</p>
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
              placeholder="e.g. Aisha"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="premium-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Optional email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Adding...' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}