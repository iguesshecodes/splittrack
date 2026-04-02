import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CreateGroupModal from '../components/CreateGroupModal'

const EMOJIS = ['🏖️', '🎉', '🍕', '✈️', '🏠', '🎮', '🍻', '⚽', '🎵', '🌍']

export default function Dashboard({ session, onSelectGroup, onOpenPersonal }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const profile = session.user

  useEffect(() => {
    fetchGroups()
  }, [])

  async function fetchGroups() {
    setLoading(true)

    const { data, error } = await supabase
      .from('group_members')
      .select('group_id, groups(id, name, description, created_at)')
      .eq('user_id', profile.id)
      .order('joined_at', { ascending: false })

    if (!error && data) {
      setGroups(data.map((d) => d.groups).filter(Boolean))
    }

    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

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
          <span className="topbar-user">
            {profile.user_metadata?.name || profile.email}
          </span>
          <button
            className="btn btn-sm"
            style={{
              color: 'rgba(255,255,255,0.85)',
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
        <div className="dashboard-hero">
          <div>
            <h1>Welcome back 👋</h1>
            <p>
              Manage your shared groups and personal finances from one place.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <button className="btn" onClick={onOpenPersonal}>
              Personal Finance
            </button>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              + New Group
            </button>
          </div>
        </div>

        <div className="dashboard-feature-card">
          <div>
            <h2>Personal Finance</h2>
            <p>
              Track your own expenses, income, savings, and remaining balance.
            </p>
          </div>
          <button className="btn btn-primary" onClick={onOpenPersonal}>
            Open
          </button>
        </div>

        <div className="dashboard-groups-header">
          <div>
            <h2>Your Groups</h2>
            <p>
              {groups.length} active {groups.length === 1 ? 'group' : 'groups'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading your groups...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>No groups yet</div>
            <div>Create your first group to start splitting expenses</div>
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
            fetchGroups()
          }}
        />
      )}
    </div>
  )
}