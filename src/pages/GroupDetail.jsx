import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import AddMemberModal from '../components/AddMemberModal'
import AddExpenseModal from '../components/AddExpenseModal'
import EditMemberModal from '../components/EditMemberModal'
import EditExpenseModal from '../components/EditExpenseModal'
import GroupExpenseChart from '../components/GroupExpenseChart'

export default function GroupDetail({ session }) {
  const navigate = useNavigate()
  const { groupId } = useParams()

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [expenseSplits, setExpenseSplits] = useState([])
  const [settlementHistory, setSettlementHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)

  const [editingMember, setEditingMember] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    if (groupId) {
      fetchGroupData()
    }
  }, [groupId])

  const fetchGroupData = async () => {
    try {
      setLoading(true)

      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()

      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)

      const { data: expensesData, error: expensesError } = await supabase
        .from('group_expenses')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })

      const { data: settlementsData, error: settlementsError } = await supabase
        .from('settlements')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })

      if (groupError) throw groupError
      if (membersError) throw membersError
      if (expensesError) throw expensesError
      if (settlementsError) throw settlementsError

      const expenseIds = (expensesData || []).map((expense) => expense.id)

      let splitsData = []
      if (expenseIds.length > 0) {
        const { data: fetchedSplits, error: splitsError } = await supabase
          .from('expense_splits')
          .select('*')
          .in('expense_id', expenseIds)

        if (splitsError) throw splitsError
        splitsData = fetchedSplits || []
      }

      setGroup(groupData)
      setMembers(membersData || [])
      setExpenses(expensesData || [])
      setExpenseSplits(splitsData)
      setSettlementHistory(settlementsData || [])
    } catch (error) {
      console.error('Group fetch error:', error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async () => {
    const confirmed = window.confirm('Delete this whole group? This cannot be undone.')
    if (!confirmed) return

    try {
      const expenseIds = expenses.map((expense) => expense.id)

      if (expenseIds.length > 0) {
        const { error: deleteSplitsError } = await supabase
          .from('expense_splits')
          .delete()
          .in('expense_id', expenseIds)

        if (deleteSplitsError) throw deleteSplitsError
      }

      const { error: deleteExpensesError } = await supabase
        .from('group_expenses')
        .delete()
        .eq('group_id', groupId)

      if (deleteExpensesError) throw deleteExpensesError

      const { error: deleteSettlementsError } = await supabase
        .from('settlements')
        .delete()
        .eq('group_id', groupId)

      if (deleteSettlementsError) throw deleteSettlementsError

      const { error: deleteMembersError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)

      if (deleteMembersError) throw deleteMembersError

      const { error: deleteGroupError } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)

      if (deleteGroupError) throw deleteGroupError

      toast.success('Group deleted')
      navigate('/app/dashboard')
    } catch (error) {
      console.error('Delete group error:', error.message)
      toast.error(error.message)
    }
  }

  const handleDeleteMember = async (memberId) => {
    const confirmed = window.confirm('Delete this member from the group?')
    if (!confirmed) return

    try {
      const { error } = await supabase.from('group_members').delete().eq('id', memberId)
      if (error) throw error

      toast.success('Member removed')
      fetchGroupData()
    } catch (error) {
      console.error('Delete member error:', error.message)
      toast.error(error.message)
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    const confirmed = window.confirm('Delete this expense?')
    if (!confirmed) return

    try {
      const { error: splitDeleteError } = await supabase
        .from('expense_splits')
        .delete()
        .eq('expense_id', expenseId)

      if (splitDeleteError) throw splitDeleteError

      const { error } = await supabase.from('group_expenses').delete().eq('id', expenseId)
      if (error) throw error

      toast.success('Expense deleted')
      fetchGroupData()
    } catch (error) {
      console.error('Delete expense error:', error.message)
      toast.error(error.message)
    }
  }

  const handleMarkSettlement = async (item) => {
    try {
      const payload = {
        group_id: groupId,
        from_member_name: item.from,
        to_member_name: item.to,
        amount: item.amount,
      }

      const { error } = await supabase.from('settlements').insert([payload])
      if (error) throw error

      toast.success('Settlement marked as completed')
      fetchGroupData()
    } catch (error) {
      console.error('Settlement save error:', error.message)
      toast.error(error.message)
    }
  }

  const summary = useMemo(() => {
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const memberCount = members.length
    const avgPerPerson = memberCount > 0 ? totalSpent / memberCount : 0

    return {
      totalSpent,
      memberCount,
      avgPerPerson,
    }
  }, [expenses, members])

  const balances = useMemo(() => {
    if (!members.length) return []

    const paidMap = {}
    const owedMap = {}

    members.forEach((member) => {
      paidMap[String(member.id)] = 0
      owedMap[String(member.id)] = 0
    })

    expenses.forEach((expense) => {
      const payerId = String(expense.paid_by)
      paidMap[payerId] = (paidMap[payerId] || 0) + Number(expense.amount || 0)
    })

    expenseSplits.forEach((split) => {
      const memberId = String(split.member_id)
      owedMap[memberId] = (owedMap[memberId] || 0) + Number(split.amount || 0)
    })

    let result = members.map((member) => {
      const paid = paidMap[String(member.id)] || 0
      const owes = owedMap[String(member.id)] || 0
      const net = paid - owes

      return {
        id: member.id,
        name: member.name || member.email || 'Unknown',
        email: member.email || '',
        paid,
        owes,
        net,
      }
    })

    settlementHistory.forEach((settlement) => {
      result = result.map((person) => {
        if (person.name === settlement.from_member_name) {
          return {
            ...person,
            net: person.net + Number(settlement.amount || 0),
          }
        }

        if (person.name === settlement.to_member_name) {
          return {
            ...person,
            net: person.net - Number(settlement.amount || 0),
          }
        }

        return person
      })
    })

    return result
  }, [members, expenses, expenseSplits, settlementHistory])

  const settlements = useMemo(() => {
    const creditors = balances
      .filter((person) => person.net > 0.01)
      .map((person) => ({ ...person, amount: person.net }))

    const debtors = balances
      .filter((person) => person.net < -0.01)
      .map((person) => ({ ...person, amount: Math.abs(person.net) }))

    const result = []

    let i = 0
    let j = 0

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]

      const settleAmount = Math.min(debtor.amount, creditor.amount)

      result.push({
        from: debtor.name,
        to: creditor.name,
        amount: settleAmount,
      })

      debtor.amount -= settleAmount
      creditor.amount -= settleAmount

      if (debtor.amount < 0.01) i++
      if (creditor.amount < 0.01) j++
    }

    return result
  }, [balances])

  const groupChartData = useMemo(() => {
    const grouped = {}

    expenses.forEach((item) => {
      const key = item.category || 'General'
      grouped[key] = (grouped[key] || 0) + Number(item.amount || 0)
    })

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }))
  }, [expenses])

  if (loading) {
    return <div className="loading-screen">Loading group details...</div>
  }

  if (!group) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>Group not found</h3>
        <p>This group could not be loaded.</p>
        <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')}>
          Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="group-page group-page-v2">
        <div className="group-hero group-hero-v2">
          <div>
            <span className="dashboard-badge">Shared expenses</span>
            <h1>{group.name || 'Untitled group'}</h1>
            <p>
              {group.description || 'Track shared expenses, balances, and group money flow.'}
            </p>
          </div>

          <div className="group-hero-actions">
            <button className="btn" onClick={() => setShowAddMember(true)}>
              Add member
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setShowAddExpense(true)}
              disabled={members.length === 0}
            >
              Add expense
            </button>

            <button className="btn danger-btn" onClick={handleDeleteGroup}>
              Delete group
            </button>

            <button className="back-btn" onClick={() => navigate('/app/dashboard')}>
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="group-summary-grid">
          <div className="group-summary-card">
            <span>Total spent</span>
            <strong>£{summary.totalSpent.toFixed(2)}</strong>
          </div>

          <div className="group-summary-card">
            <span>Members</span>
            <strong>{summary.memberCount}</strong>
          </div>

          <div className="group-summary-card">
            <span>Average per person</span>
            <strong>£{summary.avgPerPerson.toFixed(2)}</strong>
          </div>
        </div>

        {groupChartData.length > 0 && (
          <section className="group-card-section">
            <GroupExpenseChart data={groupChartData} />
          </section>
        )}

        <div className="group-layout-grid">
          <section className="group-card-section">
            <div className="group-section-header">
              <h2>Members</h2>
            </div>

            <div className="group-panel">
              {members.length === 0 ? (
                <div className="dashboard-empty-mini">
                  No members added yet. Add members first before adding shared expenses.
                </div>
              ) : (
                members.map((member) => {
                  const personBalance = balances.find((b) => String(b.id) === String(member.id))
                  const net = personBalance?.net || 0

                  return (
                    <div key={member.id} className="group-member-row">
                      <div className="group-avatar">
                        {(member.name || member.email || 'U').slice(0, 2).toUpperCase()}
                      </div>

                      <div className="group-member-main">
                        <div className="group-member-name">
                          {member.name || 'Unnamed member'}
                        </div>
                        <div className="group-member-email">
                          {member.email || 'No email'}
                        </div>
                      </div>

                      <div
                        className={`group-balance ${
                          net > 0.01 ? 'positive' : net < -0.01 ? 'negative' : 'neutral'
                        }`}
                      >
                        {net > 0.01
                          ? `Gets back £${net.toFixed(2)}`
                          : net < -0.01
                          ? `Owes £${Math.abs(net).toFixed(2)}`
                          : 'Settled'}
                      </div>

                      <div className="table-actions">
                        <button
                          className="edit-btn"
                          onClick={() => setEditingMember(member)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <section className="group-card-section">
            <div className="group-section-header">
              <h2>Balances</h2>
            </div>

            <div className="group-insight-card">
              {balances.length === 0 ? (
                <p className="insight-note">No balance data yet.</p>
              ) : (
                <>
                  {balances.map((person) => (
                    <div key={person.id} className="insight-line">
                      <span>{person.name}</span>
                      <strong>
                        {person.net > 0.01
                          ? `+£${person.net.toFixed(2)}`
                          : person.net < -0.01
                          ? `-£${Math.abs(person.net).toFixed(2)}`
                          : '£0.00'}
                      </strong>
                    </div>
                  ))}

                  <p className="insight-note">
                    Positive means this person should receive money. Negative means this
                    person owes money.
                  </p>
                </>
              )}
            </div>
          </section>
        </div>

        <section className="group-card-section">
          <div className="group-section-header">
            <h2>Suggested settlements</h2>
          </div>

          <div className="group-panel">
            {settlements.length === 0 ? (
              <div className="dashboard-empty-mini">
                No settlements needed yet. Everyone is balanced.
              </div>
            ) : (
              settlements.map((item, index) => (
                <div key={index} className="settlement-row">
                  <div className="settlement-main">
                    <div className="settlement-title">
                      {item.from} → {item.to}
                    </div>
                    <div className="settlement-meta">
                      Settle this amount to balance the group
                    </div>
                  </div>

                  <div className="settlement-amount">£{item.amount.toFixed(2)}</div>

                  <button
                    className="btn btn-sm"
                    onClick={() => handleMarkSettlement(item)}
                  >
                    Mark settled
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="group-card-section">
          <div className="group-section-header">
            <h2>Settlement history</h2>
          </div>

          <div className="group-panel">
            {settlementHistory.length === 0 ? (
              <div className="dashboard-empty-mini">
                No settlements recorded yet.
              </div>
            ) : (
              settlementHistory.map((item) => (
                <div key={item.id} className="settlement-row">
                  <div className="settlement-main">
                    <div className="settlement-title">
                      {item.from_member_name} → {item.to_member_name}
                    </div>
                    <div className="settlement-meta">
                      Completed settlement
                    </div>
                  </div>

                  <div className="settlement-amount">
                    £{Number(item.amount || 0).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="group-card-section">
          <div className="group-section-header">
            <h2>Expenses</h2>
          </div>

          <div className="group-panel">
            {expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🧾</div>
                <h3>No group expenses yet</h3>
                <p>Add your first shared expense to start tracking this group.</p>
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="group-expense-row">
                  <div className="group-expense-icon">💸</div>

                  <div className="group-expense-main">
                    <div className="group-expense-title">
                      {expense.title || 'Untitled expense'}
                    </div>
                    <div className="group-expense-meta">
                      {expense.category || 'General'} • Paid by{' '}
                      {expense.paid_by_name || expense.paid_by || 'Unknown'} •{' '}
                      {expense.split_type === 'custom' ? 'Custom split' : 'Equal split'}
                    </div>
                  </div>

                  <div className="group-expense-amount">
                    £{Number(expense.amount || 0).toFixed(2)}
                  </div>

                  <div className="table-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setEditingExpense(expense)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {showAddMember && (
        <AddMemberModal
          groupId={groupId}
          onClose={() => setShowAddMember(false)}
          onAdded={fetchGroupData}
        />
      )}

      {showAddExpense && (
        <AddExpenseModal
          groupId={groupId}
          members={members}
          onClose={() => setShowAddExpense(false)}
          onAdded={fetchGroupData}
        />
      )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdated={fetchGroupData}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          members={members}
          onClose={() => setEditingExpense(null)}
          onUpdated={fetchGroupData}
        />
      )}
    </>
  )
}