export default function BudgetProgress({ budget = 0, spent = 0 }) {
  const safeBudget = Number(budget || 0)
  const safeSpent = Number(spent || 0)

  const progress = safeBudget > 0 ? Math.min((safeSpent / safeBudget) * 100, 100) : 0
  const remaining = safeBudget - safeSpent
  const overBudget = remaining < 0

  return (
    <div className="budget-progress-card">
      <div className="budget-progress-top">
        <div>
          <span className="budget-progress-label">Monthly budget</span>
          <h3>£{safeBudget.toFixed(2)}</h3>
        </div>

        <div className={`budget-progress-status ${overBudget ? 'danger' : 'good'}`}>
          {safeBudget === 0
            ? 'No budget set'
            : overBudget
            ? `Over by £${Math.abs(remaining).toFixed(2)}`
            : `£${remaining.toFixed(2)} left`}
        </div>
      </div>

      <div className="budget-progress-bar">
        <div
          className={`budget-progress-fill ${overBudget ? 'danger' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="budget-progress-meta">
        <span>Spent: £{safeSpent.toFixed(2)}</span>
        <span>{progress.toFixed(0)}% used</span>
      </div>
    </div>
  )
}