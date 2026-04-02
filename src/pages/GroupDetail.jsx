import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AddExpenseModal from '../components/AddExpenseModal'
import AddMemberModal from '../components/AddMemberModal'

const COLORS = [
  { bg: '#d8f3dc', fg: '#1a3d2b' },
  { bg: '#dbe4ff', fg: '#2f3e8f' },
  { bg: '#fff3bf', fg: '#7c5c00' },
  { bg: '#ffd8d8', fg: '#8b1e1e' },
  { bg: '#e5dbff', fg: '#4a2d8f' },
  { bg: '#d3f9d8', fg: '#1a5c2a' },
]

function initials(name = '') {
  return name
    .trim()
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function computeSettlements(members, expenses) {
  const balances = {}

  members.forEach((m) => {
    balances[m.user_id] = 0
  })

  expenses.forEach((exp) => {
    const splits = exp.expense_splits || []
    balances[exp.paid_by] = (balances[exp.paid_by] || 0) + Number(exp.amount)

    splits.forEach((s) => {
      balances[s.user_id] = (balances[s.user_id] || 0) - Number(s.amount)
    })
  })

  const creditors = []
  const debtors = []

  Object.entries(balances).forEach(([id, value]) => {
    const rounded = parseFloat(value.toFixed(2))
    if (rounded > 0.005) creditors.push({ id, value: rounded })
    else if (rounded < -0.005) debtors.push({ id, value: rounded })
  })

  creditors.sort((a, b) => b.value - a.value)
  debtors.sort((a, b) => a.value - b.value)

  const transactions = []
  let ci = 0
  let di = 0

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]
    const amount = Math.min(creditor.value, -debtor.value)

    transactions.push({
      from: debtor.id,
      to: creditor.id,
      amount,
    })

    creditor.value -= amount
    debtor.value += amount

    if (Math.abs(creditor.value) < 0.005) ci++
    if (Math.abs(debtor.value) < 0.005) di++
  }

  return { balances, transactions }
}

export default function GroupDetail({ group, session, onBack }) {
  const [tab, setTab] = useState('expenses')
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddExp, setShowAddExp] = useState(false)
  const [showAddMem, setShowAddMem] = useState(false)

  const currency = group.currency || '£'

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)

    const [{ data: mems }, { data: exps }] = await Promise.all([
      supabase
        .from('group_members')
        .select('user_id, profiles(id, name, email)')
        .eq('group_id', group.id),

      supabase
        .from('expenses')
        .select('*, expense_splits(*), profiles!paid_by(name)')
        .eq('group_id', group.id)
        .order('created_at', { ascending: false }),
    ])

    setMembers(mems || [])
    setExpenses(exps || [])
    setLoading(false)
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

  const memberMap = {}
  members.forEach((m, i) => {
    memberMap[m.user_id] = {
      ...m.profiles,
      color: COLORS[i % COLORS.length],
    }
  })

  const { balances, transactions } = computeSettlements(members, expenses)

  async function deleteExpense(expenseId) {
    const ok = window.confirm('Delete this expense?')
    if (!ok) return

    await supabase.from('expense_splits').delete().eq('expense_id', expenseId)
    await supabase.from('expenses').delete().eq('id', expenseId)

    fetchAll()
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-sm"
            style={{
              color: 'white',
              background: 'rgba(255,255,255,0.12)',
              border: 'none'
            }}
            onClick={onBack}
          >
            ← Back
          </button>
          <span className="topbar-wordmark">{group.name}</span>
        </div>

        <button
          className="btn btn-sm"
          style={{
            color: 'rgba(255,255,255,0.9)',
            background: 'rgba(255,255,255,0.12)',
            border: 'none'
          }}
          onClick={() => setShowAddMem(true)}
        >
          + Member
        </button>
      </div>

      <div className="group-page">
        <div className="group-hero">
          <div>
            <h1>{group.name}</h1>
            <p>{group.description || 'Track shared expenses and settle up beautifully.'}</p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddExp(true)}>
            + Add Expense
          </button>
        </div>

        <div className="group-summary-grid">
          <div className="group-summary-card">
            <span>Total Spent</span>
            <strong>{currency}{totalSpent.toFixed(2)}</strong>
          </div>

          <div className="group-summary-card">
            <span>Expenses</span>
            <strong>{expenses.length}</strong>
          </div>

          <div className="group-summary-card">
            <span>Members</span>
            <strong>{members.length}</strong>
          </div>
        </div>

        <div className="group-tabs">
          <button className={tab === 'expenses' ? 'active' : ''} onClick={() => setTab('expenses')}>
            Expenses
          </button>
          <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>
            Members
          </button>
          <button className={tab === 'settle' ? 'active' : ''} onClick={() => setTab('settle')}>
            Settle Up
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading group...</div>
        ) : (
          <>
            {tab === 'expenses' && (
              <div className="group-card-section">
                <div className="group-section-header">
                  <h2>All Expenses</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddExp(true)}>
                    + Add
                  </button>
                </div>

                <div className="group-panel">
                  {expenses.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">💳</div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>No expenses yet</div>
                      <div>Add your first shared expense to get started.</div>
                    </div>
                  ) : (
                    expenses.map((expense) => {
                      const payer = memberMap[expense.paid_by]
                      const isOwn = expense.created_by === session.user.id

                      return (
                        <div className="group-expense-row" key={expense.id}>
                          <div className="group-expense-icon">💳</div>

                          <div className="group-expense-main">
                            <div className="group-expense-title">{expense.description}</div>
                            <div className="group-expense-meta">
                              Paid by {payer?.name || 'Someone'} ·{' '}
                              {new Date(expense.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </div>
                          </div>

                          <div className="group-expense-amount">
                            {currency}{Number(expense.amount).toFixed(2)}
                          </div>

                          {isOwn && (
                            <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {tab === 'members' && (
              <div className="group-card-section">
                <div className="group-section-header">
                  <h2>Group Members</h2>
                  <button className="btn btn-sm" onClick={() => setShowAddMem(true)}>
                    + Add Member
                  </button>
                </div>

                <div className="group-panel">
                  {members.map((member, i) => {
                    const profile = member.profiles
                    const color = COLORS[i % COLORS.length]
                    const balance = parseFloat((balances[member.user_id] || 0).toFixed(2))

                    return (
                      <div className="group-member-row" key={member.user_id}>
                        <div
                          className="group-avatar"
                          style={{ background: color.bg, color: color.fg }}
                        >
                          {initials(profile?.name)}
                        </div>

                        <div className="group-member-main">
                          <div className="group-member-name">{profile?.name}</div>
                          <div className="group-member-email">{profile?.email}</div>
                        </div>

                        <div
                          className={
                            balance > 0
                              ? 'group-balance positive'
                              : balance < 0
                              ? 'group-balance negative'
                              : 'group-balance neutral'
                          }
                        >
                          {balance > 0
                            ? `+${currency}${balance.toFixed(2)}`
                            : balance < 0
                            ? `-${currency}${Math.abs(balance).toFixed(2)}`
                            : 'settled'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {tab === 'settle' && (
              <div className="group-card-section">
                <div className="group-section-header">
                  <h2>Who Pays Whom</h2>
                </div>

                <div className="group-panel">
                  {transactions.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">✅</div>
                      <div style={{ fontWeight: 700 }}>Everyone is settled!</div>
                    </div>
                  ) : (
                    transactions.map((tx, i) => {
                      const from = memberMap[tx.from]
                      const to = memberMap[tx.to]

                      return (
                        <div className="group-member-row" key={i}>
                          <div
                            className="group-avatar"
                            style={{
                              background: from?.color?.bg,
                              color: from?.color?.fg
                            }}
                          >
                            {initials(from?.name)}
                          </div>

                          <div className="group-member-main">
                            <div className="group-member-name">
                              {from?.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>pays</span> {to?.name}
                            </div>
                          </div>

                          <div className="group-balance positive">
                            {currency}{tx.amount.toFixed(2)}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showAddExp && (
        <AddExpenseModal
          group={group}
          members={members}
          session={session}
          onClose={() => setShowAddExp(false)}
          onAdded={() => {
            setShowAddExp(false)
            fetchAll()
          }}
        />
      )}

      {showAddMem && (
        <AddMemberModal
          group={group}
          onClose={() => setShowAddMem(false)}
          onAdded={() => {
            setShowAddMem(false)
            fetchAll()
          }}
        />
      )}
    </div>
  )
}