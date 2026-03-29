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

    if (!error) {
      setTransactions(data)
    }
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
      const response = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', editingId)

      error = response.error
    } else {
      const response = await supabase
        .from('transactions')
        .insert(payload)

      error = response.error
    }

    if (error) {
      alert(error.message)
      return
    }

    fetchTransactions()
    resetForm()
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id)
    setTitle(transaction.title || '')
    setAmount(transaction.amount || '')
    setType(transaction.type || 'expense')
    setCategory(transaction.category || '')
    setDate(transaction.date || '')
    setNotes(transaction.notes || '')
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Delete this transaction?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchTransactions()

    if (editingId === id) {
      resetForm()
    }
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

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const thisMonthTransactions = transactions.filter((t) => {
    const txDate = new Date(t.date)
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
  })

  const thisMonthExpenses = thisMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const thisMonthSavings = thisMonthTransactions
    .filter((t) => t.type === 'saving')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const filteredTransactions =
    filterType === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filterType)

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '20px',
          background: '#f3f4f6',
          border: '1px solid #ddd',
          padding: '10px 14px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: '6px' }}>Personal Finance</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Track your income, expenses, and savings in one place.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <div style={cardStyle('#ffe8e8')}>
          <div style={cardLabel}>Total Expenses</div>
          <div style={cardValue}>£{totalExpenses.toFixed(2)}</div>
        </div>

        <div style={cardStyle('#e8f7ee')}>
          <div style={cardLabel}>Total Income</div>
          <div style={cardValue}>£{totalIncome.toFixed(2)}</div>
        </div>

        <div style={cardStyle('#e8efff')}>
          <div style={cardLabel}>Total Savings</div>
          <div style={cardValue}>£{totalSavings.toFixed(2)}</div>
        </div>

        <div style={cardStyle(remainingBalance >= 0 ? '#ecfdf3' : '#fff1f0')}>
          <div style={cardLabel}>Remaining Balance</div>
          <div style={cardValue}>£{remainingBalance.toFixed(2)}</div>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '24px',
          border: '1px solid #eee'
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '12px' }}>This Month Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>Income: <strong>£{thisMonthIncome.toFixed(2)}</strong></div>
          <div>Expenses: <strong>£{thisMonthExpenses.toFixed(2)}</strong></div>
          <div>Savings: <strong>£{thisMonthSavings.toFixed(2)}</strong></div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginBottom: '32px',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #eee'
        }}
      >
        <input
          type="text"
          placeholder="Title / Item name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={inputStyle}
        />

        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="saving">Saving</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
          <button type="submit" style={primaryButtonStyle}>
            {editingId ? 'Update transaction' : 'Save transaction'}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <h2 style={{ margin: 0 }}>Your Transactions</h2>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ ...inputStyle, width: '200px' }}
        >
          <option value="all">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="saving">Saving</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #eee'
          }}
        >
          No transactions found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #eee'
            }}
          >
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Notes</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={tdStyle}>{t.title}</td>
                  <td style={tdStyle}>£{Number(t.amount).toFixed(2)}</td>
                  <td style={tdStyle}>{t.type}</td>
                  <td style={tdStyle}>{t.category || '—'}</td>
                  <td style={tdStyle}>{t.date}</td>
                  <td style={tdStyle}>{t.notes || '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(t)} style={editButtonStyle}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(t.id)} style={deleteButtonStyle}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function cardStyle(bg) {
  return {
    padding: '16px',
    borderRadius: '12px',
    background: bg,
    border: '1px solid rgba(0,0,0,0.04)'
  }
}

const cardLabel = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '6px'
}

const cardValue = {
  fontSize: '24px',
  fontWeight: 'bold'
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  background: 'white'
}

const primaryButtonStyle = {
  padding: '12px 16px',
  background: '#1f4d3a',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600
}

const secondaryButtonStyle = {
  padding: '12px 16px',
  background: '#e5e7eb',
  color: '#111827',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600
}

const editButtonStyle = {
  background: '#1677ff',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '6px',
  cursor: 'pointer'
}

const deleteButtonStyle = {
  background: '#ff4d4f',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '6px',
  cursor: 'pointer'
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px'
}

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #f1f5f9',
  fontSize: '14px'
}