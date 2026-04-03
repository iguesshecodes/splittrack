import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ExpenseBarChart from '../components/ExpenseBarChart'
import CreateGroupModal from '../components/CreateGroupModal'

export default function Dashboard({ session }) {
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const userId = session?.user?.id

      const { data: expensesData, error: expensesError } = await supabase
        .from('personal_expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false })

      if (expensesError) throw expensesError
      if (groupsError) throw groupsError

      setExpenses(expensesData || [])
      setGroups(groupsData || [])
    } catch (error) {
      console.error('Dashboard fetch error:', error.message)
    } finally {
      setLoading(false)
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

  const recentExpenses = expenses.slice(0, 5)

  const chartData = useMemo(() => {
    const expenseOnly = expenses.filter((item) => item.type === 'expense')
    const grouped = {}

    expenseOnly.forEach((item) => {
      const key = item.category || 'General'
      grouped[key] = (grouped[key] || 0) + Number(item.amount || 0)
    })

    return Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount,
    }))
  }, [expenses])

  const showOnboarding = expenses.length === 0 && groups.length === 0

  if (loading) {
    return <div className="loading-screen">Loading your dashboard...</div>
  }

  return (
    <>
      <div className="dashboard-page dashboard-page-v2">
        <section className="dashboard-welcome-panel">
          <div>
            <span className="dashboard-badge">Overview</span>
            <h2 className="dashboard-page-title">
              Hey, {session?.user?.email?.split('@')[0] || 'there'} 👋
            </h2>
            <p className="dashboard-page-subtitle">
              Here’s your money snapshot — personal spending, budget movement, and group
              expense activity all in one place.
            </p>
          </div>

          <div className="dashboard-welcome-actions">
            <button className="btn btn-primary" onClick={() => navigate('/app/personal')}>
              Open personal finance
            </button>

            <button className="btn" onClick={() => setShowCreateGroup(true)}>
              Create group
            </button>
          </div>
        </section>

        {showOnboarding && (
          <section className="onboarding-card">
            <span className="dashboard-card-kicker">Getting started</span>
            <h2>Set up SplitTrack in 2 easy steps</h2>
            <div className="onboarding-steps">
              <div className="onboarding-step">
                <div className="onboarding-step-number">01</div>
                <div>
                  <strong>Add your first personal expense</strong>
                  <p>Start tracking your own spending and budgeting flow.</p>
                  <button className="btn btn-sm" onClick={() => navigate('/app/personal')}>
                    Go to personal
                  </button>
                </div>
              </div>

              <div className="onboarding-step">
                <div className="onboarding-step-number">02</div>
                <div>
                  <strong>Create your first group</strong>
                  <p>Set up a trip, flat, or dinner group and start splitting.</p>
                  <button className="btn btn-sm" onClick={() => setShowCreateGroup(true)}>
                    Create group
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-stats-grid dashboard-stats-grid-v2">
          <div className="dashboard-stat-card balance">
            <span>Total balance</span>
            <strong>£{stats.balance.toFixed(2)}</strong>
          </div>

          <div className="dashboard-stat-card income">
            <span>Total income</span>
            <strong>£{stats.income.toFixed(2)}</strong>
          </div>

          <div className="dashboard-stat-card expense">
            <span>Total spent</span>
            <strong>£{stats.spent.toFixed(2)}</strong>
          </div>

          <div className="dashboard-stat-card savings">
            <span>Estimated savings</span>
            <strong>£{stats.savings.toFixed(2)}</strong>
          </div>
        </section>

        <section className="dashboard-chart-section">
          {chartData.length === 0 ? (
            <div className="dashboard-main-card">
              <span className="dashboard-card-kicker">Insights</span>
              <h2>No chart data yet</h2>
              <p className="dashboard-card-copy">
                Add some expense entries in your personal page to unlock visual insights.
              </p>
            </div>
          ) : (
            <ExpenseBarChart data={chartData} />
          )}
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-main-card">
            <div className="dashboard-card-top">
              <div>
                <span className="dashboard-card-kicker">Personal finance</span>
                <h2>Recent activity</h2>
              </div>

              <button className="btn btn-sm" onClick={() => navigate('/app/personal')}>
                View all
              </button>
            </div>

            <p className="dashboard-card-copy">
              Keep an eye on your latest transactions and spending flow without digging
              through tables.
            </p>

            {recentExpenses.length === 0 ? (
              <div className="dashboard-empty-mini">
                No personal transactions yet. Start by adding your first expense.
              </div>
            ) : (
              <div className="dashboard-recent-list">
                {recentExpenses.map((item) => (
                  <div key={item.id} className="dashboard-recent-item">
                    <div>
                      <div className="dashboard-recent-title">
                        {item.title || item.category || 'Untitled entry'}
                      </div>
                      <div className="dashboard-recent-meta">
                        {item.category || 'General'} • {item.type || 'expense'}
                      </div>
                    </div>

                    <div className="dashboard-recent-amount">
                      {item.type === 'income' ? '+' : '-'}£
                      {Number(item.amount || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-main-card dashboard-side-cta">
            <span className="dashboard-card-kicker">Quick action</span>
            <h2>Track your money without the chaos.</h2>
            <p className="dashboard-card-copy">
              Add expenses, review your spending, and keep your budget visible in one calm
              workspace.
            </p>

            <button className="btn btn-primary" onClick={() => navigate('/app/personal')}>
              Go to personal page
            </button>
          </div>
        </section>

        <section className="dashboard-groups-block">
          <div className="dashboard-groups-header dashboard-groups-header-v2">
            <div>
              <h2>Your groups</h2>
              <p>Shared spaces for trips, rent, dinners, and every split-money moment.</p>
            </div>

            <button className="btn btn-sm" onClick={() => setShowCreateGroup(true)}>
              + New group
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No groups yet</h3>
              <p>Create your first shared expense group to get started.</p>
            </div>
          ) : (
            <div className="dashboard-groups-grid">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="dashboard-group-card dashboard-group-card-v2"
                  onClick={() => navigate(`/app/groups/${group.id}`)}
                >
                  <div className="dashboard-group-icon">
                    {group.emoji || '💸'}
                  </div>

                  <div className="dashboard-group-content">
                    <div className="dashboard-group-name">
                      {group.name || 'Untitled group'}
                    </div>
                    <div className="dashboard-group-desc">
                      {group.description || 'Shared expense group'}
                    </div>
                  </div>

                  <div className="dashboard-group-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          session={session}
          onClose={() => setShowCreateGroup(false)}
          onCreated={fetchDashboardData}
        />
      )}
    </>
  )
}