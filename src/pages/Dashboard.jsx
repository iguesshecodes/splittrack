import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CreateGroupModal from '../components/CreateGroupModal'

const EMOJIS = ['🏖️', '🎉', '🍕', '✈️', '🏠', '🎮', '🍻', '⚽', '🎵', '🌍']

export default function Dashboard({ session, onSelectGroup, onOpenPersonal }) {
  const [groups, setGroups] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const profile = session.user
  const firstName = profile.user_metadata?.name?.split(' ')[0] || 'there'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)

    const [{ data: groupData }, { data: txData }] = await Promise.all([
      supabase
        .from('group_members')
        .select('group_id, groups(id, name, description, created_at)')
        .eq('user_id', profile.id)
        .order('joined_at', { ascending: false }),

      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('date', { ascending: false }),
    ])

    setGroups((groupData || []).map((d) => d.groups).filter(Boolean))
    setTransactions(txData || [])
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
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

  const recentTransactions = transactions.slice(0, 4)

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="10.5" width="7" height="3" rx="1.5" fill="white" />
            <rect x="14" y="10.5" width="7" height="3" rx="1.5" fill="white" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="2" />
          </svg>
          <span className="topbar-wordmark">
            Split<span>Track</span>
          </span>
        </div>

        <div className="topbar-right">
          <span className="topbar-user">{profile.user_metadata?.name || profile.email}</span>
          <button
            className="btn btn-sm"
            style={{
              color: 'rgba(255,255,255,0.88)',
              background: 'rgba(255,255,255,0.12)',
              border: 'none'
            }}
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="dashboard-page">
        <section className="dashboard-hero premium-hero dashboard-hero-v2">
          <div className="dashboard-hero-left">
            <div className="dashboard-badge">Your financial space</div>
            <h1>Welcome back, {firstName} ✨</h1>
            <p>
              Track personal spending, monitor savings, and manage shared group expenses in one calm, premium workspace.
            </p>

            <div className="dashboard-hero-actions">
              <button className="btn btn-primary" onClick={onOpenPersonal}>
                Open Personal Finance
              </button>
              <button className="btn" onClick={() => setShowCreate(true)}>
                + Create Group
              </button>
            </div>
          </div>

          <div className="dashboard-hero-panel">
            <div className="dashboard-hero-panel-label">Current snapshot</div>
            <div className="dashboard-hero-panel-value">
              £{remainingBalance.toFixed(2)}
            </div>
            <div className="dashboard-hero-panel-sub">
              Remaining balance across your tracked finances
            </div>
          </div>
        </section>

        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span>Groups</span>
            <strong>{groups.length}</strong>
          </div>

          <div className="dashboard-stat-card income">
            <span>Total Income</span>
            <strong>£{totalIncome.toFixed(2)}</strong>
          </div>

          <div className="dashboard-stat-card expense">
            <span>Total Expenses</span>
            <strong>£{totalExpenses.toFixed(2)}</strong>
          </div>

          <div className="dashboard-stat-card savings">
            <span>Total Savings</span>
            <strong>£{totalSavings.toFixed(2)}</strong>
          </div>

          <div className="dashboard-stat-card balance">
            <span>Remaining Balance</span>
            <strong>£{remainingBalance.toFixed(2)}</strong>
          </div>
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-main-card dashboard-personal-card">
            <div className="dashboard-card-top">
              <div>
                <div className="dashboard-card-kicker">Personal finance</div>
                <h2>Understand your money in one glance</h2>
              </div>
            </div>

            <p className="dashboard-card-copy">
              View charts, track habits, and keep your personal spending, income, and savings organised beautifully.
            </p>

            <button className="btn btn-primary" onClick={onOpenPersonal}>
              Open Dashboard
            </button>
          </div>

          <div className="dashboard-main-card dashboard-recent-card">
            <div className="dashboard-card-top">
              <div>
                <div className="dashboard-card-kicker">Recent activity</div>
                <h2>Latest transactions</h2>
              </div>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="dashboard-empty-mini">No personal transactions yet.</div>
            ) : (
              <div className="dashboard-recent-list">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="dashboard-recent-item">
                    <div>
                      <div className="dashboard-recent-title">{tx.title}</div>
                      <div className="dashboard-recent-meta">
                        {tx.category || 'General'} · {tx.type}
                      </div>
                    </div>
                    <div className="dashboard-recent-amount">
                      £{Number(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-groups-header">
          <div>
            <h2>Your Groups</h2>
            <p>{groups.length} active {groups.length === 1 ? 'group' : 'groups'}</p>
          </div>
        </section>

        {loading ? (
          <div className="empty-state">Loading your dashboard...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>No groups yet</div>
            <div>Create your first group to start splitting expenses beautifully.</div>
            <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)}>
              Create a group
            </button>
          </div>
        ) : (
          <div className="dashboard-groups-grid">
            {groups.map((g, i) => (
              <div className="dashboard-group-card" key={g.id} onClick={() => onSelectGroup(g)}>
                <div className="dashboard-group-icon">{EMOJIS[i % EMOJIS.length]}</div>
                <div className="dashboard-group-content">
                  <div className="dashboard-group-name">{g.name}</div>
                  <div className="dashboard-group-desc">
                    {g.description || 'No description'}
                  </div>
                </div>
                <div className="dashboard-group-arrow">›</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateGroupModal
          session={session}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            fetchDashboardData()
          }}
        />
      )}
    </div>
  )
}