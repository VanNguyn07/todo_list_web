import React, { useState } from "react"
// Cần cài đặt: npm install lucide-react
import { Mail, Shield, MoreHorizontal, UserX, UserCheck, Camera, CheckCircle2, Activity, Search, Filter, X, RotateCcw } from "lucide-react"
import { useFetchUsers } from "../../../hooks/useFetchUsers"
import { useUsersManager } from "../../../hooks/useUsersManager"
const Button = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
  }
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    icon: "h-9 w-9",
  }
  return (
    <button className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ""}`} {...props}>
      {children}
    </button>
  )
}

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
)

const Avatar = ({ src, fallback, alt }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 items-center justify-center border">
      {!imgError && src && src !== "/placeholder.svg" ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <span className="text-sm font-medium text-gray-600">{fallback || alt?.charAt(0) || "U"}</span>
      )}
    </div>
  )
}

const Input = ({ className, ...props }) => (
  <input
    className={`flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    {...props}
  />
)

// Modal Component
const ActivityModal = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null

  const mockActivities = [
    { id: 1, action: "Logged in", timestamp: new Date("2025-01-06T14:30:00"), type: "login" },
    { id: 2, action: "Updated profile", timestamp: new Date("2025-01-06T10:15:00"), type: "update" },
    { id: 3, action: "Downloaded report", timestamp: new Date("2025-01-05T16:45:00"), type: "download" },
    { id: 4, action: "Changed password", timestamp: new Date("2025-01-04T09:20:00"), type: "security" },
    { id: 5, action: "Logged in", timestamp: new Date("2025-01-03T14:10:00"), type: "login" },
  ]

  const getActivityColor = (type) => {
    switch (type) {
      case 'login': return 'bg-blue-100 text-blue-800'
      case 'update': return 'bg-amber-100 text-amber-800'
      case 'download': return 'bg-green-100 text-green-800'
      case 'security': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-white shadow-lg animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Role</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
            <p className={`text-sm font-semibold ${user.status === 'active' ? 'text-green-600' : 'text-red-600'} capitalize`}>
              {user.status}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Joined</p>
            <p className="text-sm font-semibold text-gray-900">{user.joinedAt.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Export Activity
          </Button>
        </div>
      </div>
    </div>
  )
}

// --- Main Component ---

export default function UserManagement() {
  const {users, setUsers} = useFetchUsers();
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUserForActivity, setSelectedUserForActivity] = useState(null)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)

  const {handleToggleStatus} = useUsersManager(setUsers)
  // Simple filtering logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Helpers for styling
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  const getStatusBadgeClass = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  }

  // Handle actions
  const handleViewActivity = (user) => {
    setSelectedUserForActivity(user)
    setIsActivityModalOpen(true)
  }

  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false)
    setSelectedUserForActivity(null)
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-base text-gray-600 mt-1">Manage users, roles, and account status</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-9"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter:</span>
          <div className="relative flex-1 sm:flex-none sm:w-40">
             <select 
                className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
             >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
             </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b bg-gray-50 transition-colors hover:bg-gray-50/50">
                <th className="h-12 px-4 align-middle font-medium text-gray-600">User</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-600">Role</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-600">Status</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-600">Last Active</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="size-8 text-gray-300" />
                      <p className="text-gray-500 font-medium">No users found matching your search.</p>
                      {(searchQuery || statusFilter !== "all") && (
                        <button 
                          onClick={handleResetFilters}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
                        >
                          Reset filters to see all users
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-gray-50/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} fallback={user.username.charAt(0)} alt={user.username} />
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="size-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={getRoleBadgeClass(user.role)}>
                        <Shield className="mr-1 size-3" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={getStatusBadgeClass(user.status)}>
                        {user.status === 'active' ? <UserCheck className="mr-1 size-3" /> : <UserX className="mr-1 size-3" />}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-gray-600 text-sm">
                      <div>{user.last_login ? new Date(user.last_login).toLocaleDateString() : "N/A"}</div>
                      <div className="text-xs text-gray-500">{user.last_login ? new Date(user.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            title="View Activity"
                            onClick={() => handleViewActivity(user)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Activity className="size-4" />
                        </Button>
                        <Button 
                            size="sm" 
                            variant="ghost"
                            title={user.status === 'active' ? "Deactivate User" : "Activate User"}
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={user.status === 'active' ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                        >
                          {user.status === 'active' ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal 
        isOpen={isActivityModalOpen} 
        user={selectedUserForActivity} 
        onClose={handleCloseActivityModal}
      />
    </div>
  )
}