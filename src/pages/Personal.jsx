import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORY_OPTIONS = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Rent',
  'Entertainment',
  'Travel',
  'Health',
  'Education',
  'Salary',
  'Savings',
  'Other'
]

export default function Personal({ onBack, session }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [transactions, setTransactions] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [editingId, setEditingId] = useState(null)

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })

    if (!error) setTransactions(data || [])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  function resetForm() {
    setTitle('')
    setAmount('')
    setType('expense')
    setCategory('')
    setDate('')
    setNotes('')
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      user_id: session.user.id,
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: date || new Date().toISOString().split('T')[0],
      notes,
    }

    let error

    if (editingId) {
      const res = await supabase.from('transactions').update(payload).eq('id', editingId)
      error = res.error
    } else {
      const res = await supabase.from('transactions').insert(payload)
      error = res.error
    }

    if (error) {
      alert(error.message)
      return
    }

    resetForm()
    fetchTransactions()
  }

  function handleEdit(tx) {
    setEditingId(tx.id)
    setTitle(tx.title || '')
    setAmount(tx.amount || '')
    setType(tx.type || 'expense')
    setCategory(tx.category || '')
    setDate(tx.date || '')
    setNotes(tx.notes || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this transaction?')
    if (!ok) return

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }

    if (editingId === id) resetForm()
    fetchTransactions()
  }

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalSavings = transactions
    .filter((t) => t.type === 'saving')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const remainingBalance = totalIncome - totalExpenses - totalSavings

  const filteredTransactions =
    filterType === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filterType)

  return (
    <div className="personal-page">
      <div className="personal-top">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div>
          <h1>Personal Finance</h1>
          <p>Track your income, expenses, savings, and remaining balance.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card expense-card">
          <span>Total Expenses</span>
          <strong>£{totalExpenses.toFixed(2)}</strong>
        </div>

        <div className="summary-card income-card">
          <span>Total Income</span>
          <strong>£{totalIncome.toFixed(2)}</strong>
        </div>

        <div className="summary-card savings-card">
          <span>Total Savings</span>
          <strong>£{totalSavings.toFixed(2)}</strong>
        </div>

        <div className="summary-card balance-card">
          <span>Remaining Balance</span>
          <strong>£{remainingBalance.toFixed(2)}</strong>
        </div>
      </div>

      <div className="personal-card">
        <div className="card-header">
          <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
        </div>

        <form className="personal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title / Item name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="saving">Saving</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingId ? 'Update Transaction' : 'Save Transaction'}
            </button>

            {editingId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="personal-card">
        <div className="transactions-header">
          <h2>Your Transactions</h2>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="saving">Saving</option>
          </select>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-table">No transactions yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.title}</td>
                    <td>£{Number(tx.amount).toFixed(2)}</td>
                    <td>{tx.type}</td>
                    <td>{tx.category || '—'}</td>
                    <td>{tx.date}</td>
                    <td>{tx.notes || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="edit-btn" onClick={() => handleEdit(tx)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(tx.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}