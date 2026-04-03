import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const initialForm = {
  name: '',
  description: '',
  emoji: '💸',
}

export default function CreateGroupModal({ session, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Please enter a group name')
      return
    }

    try {
      setSaving(true)

      const payload = {
        name: form.name,
        description: form.description,
        emoji: form.emoji,
        created_by: session?.user?.id,
      }

      const { error } = await supabase.from('groups').insert([payload])

      if (error) throw error

      toast.success('Group created successfully')
      onCreated?.()
      onClose?.()
    } catch (error) {
      console.error('Create group error:', error.message)
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
            <h2>Create a new group</h2>
            <p>Set up a shared space for trips, rent, dinners, or anything split.</p>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="premium-modal-form" onSubmit={handleSubmit}>
          <div className="premium-field">
            <label>Group name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Bali Trip"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="premium-field">
            <label>Emoji</label>
            <input
              type="text"
              name="emoji"
              placeholder="💸"
              value={form.emoji}
              onChange={handleChange}
            />
          </div>

          <div className="premium-field premium-field-full">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="A short note about this group..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="premium-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Creating...' : 'Create group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}