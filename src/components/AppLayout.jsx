import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AppLayout({ children, session }) {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('splittrack-theme') || 'default')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('splittrack-theme', theme)
  }, [theme])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const email = session?.user?.email || 'User'

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link to="/app/dashboard" className="app-brand">
          <span>Split</span>Track
        </Link>

        <div className="app-sidebar-group">
          <div className="app-sidebar-label">Workspace</div>

          <NavLink
            to="/app/dashboard"
            className={({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')}
          >
            Overview
          </NavLink>

          <NavLink
            to="/app/personal"
            className={({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')}
          >
            Personal
          </NavLink>

          <NavLink
            to="/groups"
            className={({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')}
          >
            Public groups page
          </NavLink>
        </div>

        <div className="app-sidebar-bottom">
          <div className="app-user-card">
            <span>Signed in as</span>
            <strong>{email}</strong>
          </div>

          <button className="app-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-topbar">
          <div>
            <div className="app-topbar-kicker">SplitTrack workspace</div>
            <h1 className="app-topbar-title">Money, organised beautifully.</h1>
          </div>

          <div className="app-topbar-actions">
            <select
              className="theme-switcher"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="default">Default theme</option>
              <option value="matcha">Matcha cream</option>
              <option value="plum">Midnight plum</option>
              <option value="sky">Sky soda</option>
              <option value="dark">Dark mode</option>
            </select>
          </div>
        </div>

        <div className="app-page-content">{children}</div>
      </main>
    </div>
  )
}