import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'

import Home from './pages/Home'
import Story from './pages/Story'
import Finance from './pages/Finance'
import Groups from './pages/Groups'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import GroupDetail from './pages/GroupDetail'
import Personal from './pages/Personal'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="loading-screen">Loading SplitTrack...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Home session={session} />} />
      <Route path="/story" element={<Story session={session} />} />
      <Route path="/finance" element={<Finance session={session} />} />
      <Route path="/groups" element={<Groups session={session} />} />
      <Route path="/pricing" element={<Pricing session={session} />} />
      <Route path="/faq" element={<FAQ session={session} />} />
      <Route path="/contact" element={<Contact session={session} />} />

      <Route
        path="/login"
        element={session ? <Navigate to="/app/dashboard" replace /> : <Auth />}
      />

      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute session={session}>
            <AppLayout session={session}>
              <Dashboard session={session} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/personal"
        element={
          <ProtectedRoute session={session}>
            <AppLayout session={session}>
              <Personal session={session} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/groups/:groupId"
        element={
          <ProtectedRoute session={session}>
            <AppLayout session={session}>
              <GroupDetail session={session} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={session ? '/app/dashboard' : '/'} replace />}
      />
    </Routes>
  )
}