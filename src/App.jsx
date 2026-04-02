import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import GroupDetail from './pages/GroupDetail'
import Personal from './pages/Personal'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentGroup, setCurrentGroup] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (session) setCurrentPage('dashboard')
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (session) setCurrentPage('dashboard')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="loading-screen">Loading SplitTrack...</div>
  }

  if (!session) {
    if (currentPage === 'auth') {
      return <Auth />
    }

    return <Home onGetStarted={() => setCurrentPage('auth')} />
  }

  if (currentGroup) {
    return (
      <GroupDetail
        group={currentGroup}
        session={session}
        onBack={() => setCurrentGroup(null)}
      />
    )
  }

  if (currentPage === 'personal') {
    return (
      <Personal
        session={session}
        onBack={() => setCurrentPage('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      session={session}
      onSelectGroup={setCurrentGroup}
      onOpenPersonal={() => setCurrentPage('personal')}
    />
  )
}