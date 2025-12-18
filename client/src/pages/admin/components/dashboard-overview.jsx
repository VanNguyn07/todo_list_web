"use client"

import { Users, MessageSquare, AlertTriangle, Activity } from "lucide-react"
// Replaced shadcn imports with standard HTML/CSS structure
// Charting is kept but container logic simplified for standard CSS

const stats = [
  { title: "Total Users", value: "4,521", change: "+12%", icon: Users, color: "#2563eb", bg: "#eff6ff" },
  { title: "Active Issues", value: "23", change: "-5%", icon: AlertTriangle, color: "#d97706", bg: "#fffbeb" },
  { title: "Feedback Received", value: "156", change: "+8%", icon: MessageSquare, color: "#9333ea", bg: "#faf5ff" },
  { title: "System Health", value: "98.5%", change: "+0.5%", icon: Activity, color: "#16a34a", bg: "#f0fdf4" },
]

export default function DashboardOverview() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="card stat-card">
            <div className="card-header flex-between">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-icon-wrapper" style={{ backgroundColor: stat.bg }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div className="card-content pt-0">
              <div className="stat-value">{stat.value}</div>
              <p className={`stat-change ${stat.change.startsWith("+") ? "text-green" : "text-red"}`}>
                {stat.change} from last month
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* User Growth Chart Placeholder (Simplifying for standard CSS demo) */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Growth Statistics</h3>
          <p className="card-description">Monthly user growth over the last 6 months</p>
        </div>
        <div className="card-content">
          <div style={{ height: '300px', width: '100%', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            [Chart Component Placeholder - Recharts would render here]
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header { margin-bottom: 1.5rem; }
        .page-header p { color: var(--text-muted); font-size: 0.875rem; }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .stat-card .card-header { padding-bottom: 0.5rem; }
        .stat-title { font-size: 0.875rem; color: var(--text-muted); }
        .stat-icon-wrapper { padding: 8px; border-radius: 8px; }
        .stat-value { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
        .stat-change { font-size: 0.75rem; }
        .text-green { color: var(--success-text); }
        .text-red { color: var(--danger-text); }
        .pt-0 { padding-top: 0; }
      `}</style>
    </div>
  )
}