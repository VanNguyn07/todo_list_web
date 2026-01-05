import React from "react"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  AlertTriangle,
  Bell,
  HeadphonesIcon,
  Shield,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "users", label: "Users", icon: <Users size={18} /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquare size={18} />, badge: 3 },
  { id: "support", label: "Support", icon: <HeadphonesIcon size={18} />, badge: 5 },
  { id: "errors", label: "Errors", icon: <AlertTriangle size={18} />, badge: 2 },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
]

export default function Sidebar({ activeSection, onSectionChange, notificationCount = 0 }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex-center  px-4 z-50 shadow-sm">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity mr-8 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md">
            <Shield size={18} />
          </div>
          <div className="hidden md:flex flex-col mr-20">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Admin Panel</h1>
            <span className="text-[11px] text-gray-500 font-semibold tracking-wide">MANAGEMENT</span>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex flex-1 items-center gap-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            // const showBadge = item.id === "notifications" ? notificationCount > 0 : item.badge
            // const badgeCount = item.id === "notifications" ? notificationCount : item.badge

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? "text-blue-700 bg-blue-50 border-b-2 border-b-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={`transition-colors ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {/* {showBadge && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-sm ml-1">
                    {badgeCount}
                  </span>
                )} */}
              </button>
            )
          })}
        </div>

        {/* User Profile and Mobile Menu */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </div>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-xs font-bold text-gray-900">Admin User</span>
              <span className="text-xs text-gray-600 font-medium">Super Admin</span>
            </div>
            <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 md:hidden z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex flex-col divide-y divide-gray-200">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              const showBadge = item.id === "notifications" ? notificationCount > 0 : item.badge
              const badgeCount = item.id === "notifications" ? notificationCount : item.badge

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMobileOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`transition-colors ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {showBadge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-sm">
                      {badgeCount}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Mobile Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-200">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  )
}