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
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function computeSettlements(members, expenses) {
  const bal = {}
  members.forEach(m => { bal[m.user_id] = 0 })
  expenses.forEach(exp => {
    const splits = exp.expense_splits || []
    bal[exp.paid_by] = (bal[exp.paid_by] || 0) + Number(exp.amount)
    splits.forEach(s => { bal[s.user_id] = (bal[s.user_id] || 0) - Number(s.amount) })
  })
  const pos = [], neg = []
  Object.entries(bal).forEach(([id, b]) => {
    const v = parseFloat(b.toFixed(2))
    if (v > 0.005) pos.push({ id, b: v })
    else if (v < -0.005) neg.push({ id, b: v })
  })
  pos.sort((a, b) => b.b - a.b)
  neg.sort((a, b) => a.b - b.b)
  const txns = []
  let pi = 0, ni = 0
  while (pi < pos.length && ni < neg.length) {
    const p = pos[pi], n = neg[ni]
    const amt = Math.min(p.b, -n.b)
    txns.push({ from: n.id, to: p.id, amount: amt })
    p.b -= amt; n.b += amt
    if (Math.abs(p.b) < 0.005) pi++
    if (Math.abs(n.b) < 0.005) ni++
  }
  return { bal, txns }
}

export default function GroupDetail({ group, session, onBack }) {
  const [tab, setTab] = useState('expenses')
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddExp, setShowAddExp] = useState(false)
  const [showAddMem, setShowAddMem] = useState(false)
  const currency = group.currency || '£'

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: mems }, { data: exps }] = await Promise.all([
      supabase.from('group_members').select('user_id, profiles(id, name, email)').eq('group_id', group.id),
      supabase.from('expenses').select('*, expense_splits(*), profiles!paid_by(name)').eq('group_id', group.id).order('created_at', { ascending: false })
    ])
    setMembers(mems || [])
    setExpenses(exps || [])
    setLoading(false)
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const memberMap = {}
  members.forEach((m, i) => {
    memberMap[m.user_id] = { ...m.profiles, color: COLORS[i % COLORS.length] }
  })

  const { bal, txns } = computeSettlements(members, expenses)

  async function deleteExpense(expId) {
    if (!confirm('Delete this expense?')) return
    await supabase.from('expense_splits').delete().eq('expense_id', expId)
    await supabase.from('expenses').delete().eq('id', expId)
    fetchAll()
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-sm btn-icon" style={{ color: 'white', background: 'rgba(255,255,255,0.15)', border: 'none' }} onClick={onBack}>←</button>
          <span className="topbar-wordmark">{group.name}</span>
        </div>
        <button className="btn btn-sm" style={{ color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)', border: 'none' }} onClick={() => setShowAddMem(true)}>
          + Member
        </button>
      </div>

      <div className="page">
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-label">Total spent</div>
            <div className="stat-value">{currency}{total.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Expenses</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Members</div>
            <div className="stat-value">{members.length}</div>
          </div>
        </div>

        <div className="tabs">
          {['expenses', 'members', 'settle'].map(t => (
            <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'expenses' ? 'Expenses' : t === 'members' ? 'Members' : 'Settle up'}
            </button>
          ))}
        </div>

        {loading ? <div className="empty-state">Loading...</div> : (
          <>
            {/* EXPENSES TAB */}
            {tab === 'expenses' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="section-title">All expenses</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddExp(true)}>+ Add</button>
                </div>
                <div className="card" style={{ padding: '0 1.25rem' }}>
                  {expenses.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem 0' }}>
                      <div>No expenses yet</div>
                      <button className="btn btn-primary btn-sm mt-2" onClick={() => setShowAddExp(true)}>Add first expense</button>
                    </div>
                  ) : expenses.map(e => {
                    const payer = memberMap[e.paid_by]
                    const isOwn = e.created_by === session.user.id
                    return (
                      <div className="expense-row" key={e.id}>
                        <div className="expense-icon">💳</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="expense-desc">{e.description}</div>
                          <div className="expense-meta">Paid by {payer?.name || 'Someone'} · {new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        </div>
                        <div className="expense-amount">{currency}{Number(e.amount).toFixed(2)}</div>
                        {isOwn && (
                          <button className="btn btn-sm btn-danger btn-icon" onClick={() => deleteExpense(e.id)} title="Delete" style={{ marginLeft: 4 }}>✕</button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* MEMBERS TAB */}
            {tab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="section-title">Group members</span>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowAddMem(true)}>+ Add member</button>
                </div>
                <div className="card" style={{ padding: '0 1.25rem' }}>
                  {members.map((m, i) => {
                    const p = m.profiles
                    const c = COLORS[i % COLORS.length]
                    const b = parseFloat((bal[m.user_id] || 0).toFixed(2))
                    return (
                      <div className="settle-row" key={m.user_id}>
                        <div className="avatar" style={{ background: c.bg, color: c.fg }}>{initials(p?.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{p?.name}</div>
                          <div className="text-sm text-muted">{p?.email}</div>
                        </div>
                        <span className={b > 0 ? 'positive' : b < 0 ? 'negative' : 'neutral'} style={{ fontSize: 13, fontWeight: 500, fontFamily: 'var(--mono)' }}>
                          {b > 0 ? `+${currency}${b.toFixed(2)}` : b < 0 ? `-${currency}${Math.abs(b).toFixed(2)}` : 'settled'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SETTLE UP TAB */}
            {tab === 'settle' && (
              <div>
                <div className="section-title mb-2">Who pays whom</div>
                <div className="card" style={{ padding: '0 1.25rem' }}>
                  {txns.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem 0' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                      <div style={{ fontWeight: 500 }}>Everyone is settled!</div>
                    </div>
                  ) : txns.map((t, i) => {
                    const from = memberMap[t.from]
                    const to = memberMap[t.to]
                    return (
                      <div className="settle-row" key={i}>
                        <div className="avatar" style={{ background: from?.color?.bg, color: from?.color?.fg }}>{initials(from?.name)}</div>
                        <div style={{ flex: 1, fontSize: 14 }}>
                          <span style={{ fontWeight: 500 }}>{from?.name}</span>
                          <span className="text-muted"> pays </span>
                          <span style={{ fontWeight: 500 }}>{to?.name}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--green-700)', fontSize: 15 }}>{currency}{t.amount.toFixed(2)}</div>
                      </div>
                    )
                  })}
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
          onAdded={() => { setShowAddExp(false); fetchAll() }}
        />
      )}
      {showAddMem && (
        <AddMemberModal
          group={group}
          onClose={() => setShowAddMem(false)}
          onAdded={() => { setShowAddMem(false); fetchAll() }}
        />
      )}
    </div>
  )
}
