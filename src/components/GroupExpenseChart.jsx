import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#17392b', '#2f6f54', '#6fcf97', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6']

export default function GroupExpenseChart({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Group expense split</h3>
        <p>Category breakdown for this shared group</p>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
