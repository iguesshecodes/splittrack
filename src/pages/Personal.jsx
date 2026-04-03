import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ExpenseDonutChart from '../components/ExpenseDonutChart'
import BudgetProgress from '../components/BudgetProgress'
import toast from 'react-hot-toast'

const initialForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'General',
  note: '',
}

export default function Personal({ session }) {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [budget, setBudget] = useState('')
  const [savedBudget, setSavedBudget] = useState(0)
  const [savingBudget, setSavingBudget] = useState(false)

  useEffect(() => {
    fetchExpenses()
    fetchBudget()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)

      const userId = session?.user?.id

      const { data, error } = await supabase
        .from('personal_expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setExpenses(data || [])
    } catch (error) {
      console.error('Fetch expenses error:', error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBudget = async () => {
    try {
      const userId = session?.user?.id

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setSavedBudget(Number(data.monthly_budget || 0))
        setBudget(String(data.monthly_budget || ''))
      }
    } catch (error) {
      console.error('Fetch budget error:', error.message)
      toast.error(error.message)
    }
  }

  const handleBudgetSave = async () => {
    try {
      setSavingBudget(true)

      const userId = session?.user?.id
      const amount = Number(budget || 0)

      const { data: existing, error: existingError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existingError) throw existingError

      if (existing) {
        const { error } = await supabase
          .from('budgets')
          .update({ monthly_budget: amount })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('budgets').insert([
          {
            user_id: userId,
            monthly_budget: amount,
          },
        ])

        if (error) throw error
      }

      setSavedBudget(amount)
      toast.success('Budget saved')
    } catch (error) {
      console.error('Save budget error:', error.message)
      toast.error(error.message)
    } finally {
      setSavingBudget(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title || !form.amount) {
      toast.error('Please enter title and amount')
      return
    }

    try {
      setSaving(true)

      if (editingId) {
        const { error } = await supabase
          .from('personal_expenses')
          .update({
            title: form.title,
            amount: Number(form.amount),
            type: form.type,
            category: form.category,
            note: form.note,
          })
          .eq('id', editingId)

        if (error) throw error

        toast.success('Entry updated')
      } else {
        const payload = {
          user_id: session?.user?.id,
          title: form.title,
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
          note: form.note,
        }

        const { error } = await supabase.from('personal_expenses').insert([payload])

        if (error) throw error

        toast.success('Entry saved')
      }

      setForm(initialForm)
      setEditingId(null)
      fetchExpenses()
    } catch (error) {
      console.error('Save expense error:', error.message)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      amount: String(item.amount || ''),
      type: item.type || 'expense',
      category: item.category || 'General',
      note: item.note || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this entry?')
    if (!confirmed) return

    try {
      const { error } = await supabase.from('personal_expenses').delete().eq('id', id)
      if (error) throw error
      fetchExpenses()
      toast.success('Entry deleted')
    } catch (error) {
      console.error('Delete expense error:', error.message)
      toast.error(error.message)
    }
  }

  const stats = useMemo(() => {
    const income = expenses
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const spent = expenses
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const savings = Math.max(income - spent, 0)
    const balance = income - spent

    return { income, spent, savings, balance }
  }, [expenses])

  const donutData = useMemo(() => {
    const expenseOnly = expenses.filter((item) => item.type === 'expense')
    const grouped = {}

    expenseOnly.forEach((item) => {
      const key = item.category || 'General'
      grouped[key] = (grouped[key] || 0) + Number(item.amount || 0)
    })

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }))
  }, [expenses])

  return (
    <div className="personal-page personal-page-v2">
      <div className="personal-top personal-top-v2">
        <div>
          <span className="dashboard-badge">Personal finance</span>
          <h1>Your money, in one clean space.</h1>
          <p>
            Add income and expenses, keep an eye on your balance, and build better
            budgeting habits without the mess.
          </p>
        </div>

        <button className="back-btn" onClick={() => navigate('/app/dashboard')}>
          Back to dashboard
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-card balance-card">
          <span>Total balance</span>
          <strong>£{stats.balance.toFixed(2)}</strong>
        </div>

        <div className="summary-card income-card">
          <span>Total income</span>
          <strong>£{stats.income.toFixed(2)}</strong>
        </div>

        <div className="summary-card expense-card">
          <span>Total spent</span>
          <strong>£{stats.spent.toFixed(2)}</strong>
        </div>

        <div className="summary-card savings-card">
          <span>Estimated savings</span>
          <strong>£{stats.savings.toFixed(2)}</strong>
        </div>
      </div>

      <section className="personal-card budget-settings-card">
        <div className="card-header">
          <h2>Monthly budget goal</h2>
        </div>

        <div className="budget-settings-row">
          <input
            type="number"
            placeholder="Set your monthly budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="budget-input"
          />
          <button className="save-btn" onClick={handleBudgetSave} disabled={savingBudget}>
            {savingBudget ? 'Saving...' : 'Save budget'}
          </button>
        </div>

        <BudgetProgress budget={savedBudget} spent={stats.spent} />
      </section>

      <div className="personal-layout-grid">
        <section className="personal-card personal-form-card">
          <div className="card-header">
            <h2>{editingId ? 'Edit entry' : 'Add a new entry'}</h2>
          </div>

          <form className="personal-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />

            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select name="category" value={form.category} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Rent">Rent</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Travel">Travel</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
            </select>

            <textarea
              name="note"
              rows="4"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange}
              className="personal-note-field"
            />

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving
                  ? editingId
                    ? 'Updating...'
                    : 'Saving...'
                  : editingId
                  ? 'Update entry'
                  : 'Save entry'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="personal-insight-card-wrap">
          {donutData.length === 0 ? (
            <div className="personal-card personal-insight-card">
              <div className="card-header">
                <h2>Quick insight</h2>
              </div>

              <div className="personal-insight-box">
                <div className="insight-line">
                  <span>Income flow</span>
                  <strong>£{stats.income.toFixed(2)}</strong>
                </div>

                <div className="insight-line">
                  <span>Expense flow</span>
                  <strong>£{stats.spent.toFixed(2)}</strong>
                </div>

                <div className="insight-line">
                  <span>Current balance</span>
                  <strong>£{stats.balance.toFixed(2)}</strong>
                </div>

                <p className="insight-note">
                  Add some expense entries to unlock category visualisation.
                </p>
              </div>
            </div>
          ) : (
            <ExpenseDonutChart data={donutData} />
          )}
        </section>
      </div>

      <section className="personal-card">
        <div className="transactions-header">
          <div>
            <h2>All entries</h2>
            <p className="table-caption">Your latest personal finance activity</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen">Loading entries...</div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <h3>No entries yet</h3>
            <p>Add your first expense or income to start tracking.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title || 'Untitled'}</td>
                    <td>{item.category || 'General'}</td>
                    <td>
                      <span
                        className={
                          item.type === 'income'
                            ? 'type-pill income-pill'
                            : 'type-pill expense-pill'
                        }
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>£{Number(item.amount || 0).toFixed(2)}</td>
                    <td>{item.note || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
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
      </section>
    </div>
  )
}