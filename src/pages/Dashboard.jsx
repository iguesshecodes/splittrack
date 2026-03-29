import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CreateGroupModal from '../components/CreateGroupModal'

const EMOJIS = ['🏖️','🎉','🍕','✈️','🏠','🎮','🍻','⚽','🎵','🌍']

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
      const gs = data.map((d) => d.groups).filter(Boolean)
      setGroups(gs)
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
            <rect x="3" y="10.5" width="7" height="3" rx="1.5" fill="white"/>
            <rect x="14" y="10.5" width="7" height="3" rx="1.5" fill="white"/>
            <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="topbar-wordmark">Split<span>Track</span></span>
        </div>

        <div className="topbar-right">
          <span className="topbar-user">
            {profile.user_metadata?.name || profile.email}
          </span>
          <button
            className="btn btn-sm"
            style={{
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              border: 'none'
            }}
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="page">
        <div className="page-header">
          <div style={{ flex: 1 }}>
            <div className="page-title">Dashboard</div>
            <div className="text-sm text-muted mt-1">
              Manage your personal finances and shared group expenses
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={onOpenPersonal}>
              Personal Finance
            </button>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              + New group
            </button>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
              Personal Finance
            </div>
            <div style={{ color: '#666' }}>
              Track your own expenses, income, savings, and monthly balance.
            </div>
          </div>

          <button className="btn btn-primary" onClick={onOpenPersonal}>
            Open
          </button>
        </div>

        <div className="page-header" style={{ marginBottom: '12px' }}>
          <div>
            <div className="page-title">Your groups</div>
            <div className="text-sm text-muted mt-1">
              {groups.length} active {groups.length === 1 ? 'group' : 'groups'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading your groups...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>No groups yet</div>
            <div>Create your first group to start splitting expenses</div>
            <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)}>
              Create a group
            </button>
          </div>
        ) : (
          groups.map((g, i) => (
            <div className="group-card" key={g.id} onClick={() => onSelectGroup(g)}>
              <div className="group-icon">{EMOJIS[i % EMOJIS.length]}</div>
              <div>
                <div className="group-name">{g.name}</div>
                {g.description && <div className="group-meta">{g.description}</div>}
              </div>
              <span className="group-arrow">›</span>
            </div>
          ))
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