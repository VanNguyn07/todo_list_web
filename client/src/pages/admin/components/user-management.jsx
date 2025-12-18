"use client"

import { useState } from "react"
import { Mail, Shield, MoreHorizontal, UserX, UserCheck, Camera, CheckCircle2, Activity, Search } from "lucide-react"

// Sample Data (Same as before)
const initialUsers = [
  {
    id: "U001",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    joinedAt: new Date("2024-06-15"),
    lastActive: new Date("2025-01-06T14:30:00"),
    activities: [],
    adminActions: [],
  },
  {
    id: "U002",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg",
    role: "moderator",
    status: "active",
    joinedAt: new Date("2024-03-20"),
    lastActive: new Date("2025-01-06T12:15:00"),
    activities: [],
    adminActions: [],
  },
  // ... add more sample data if needed
]

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Simple filtering logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Helpers for styling
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'badge-info';
      case 'moderator': return 'badge-warning';
      default: return 'badge-neutral';
    }
  }

  const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-danger';
  }

  return (
    <div className="space-y-6">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>User Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage users, roles, and account status</p>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input 
            className="input-field search-input"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-wrapper">
          <span className="filter-label">Filter:</span>
          <select 
            className="input-field" 
            style={{ width: '150px', marginTop: 0 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                      <div className="avatar">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      <Shield size={12} />
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                      {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {user.lastActive.toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-ghost btn-sm">
                        <Activity size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Camera size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .search-wrapper {
          position: relative;
          max-width: 300px;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input {
          padding-left: 35px;
        }
        .filter-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .filter-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}