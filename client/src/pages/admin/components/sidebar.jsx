"use client"

import React from "react"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  AlertTriangle,
  Bell,
  HeadphonesIcon,
  LogOut,
  Shield,
  ChevronDown,
  Settings,
} from "lucide-react"

// Define styles directly in object for specific dynamic values or keep in CSS
// Here we rely on classes defined in globals.css + some inline styles for simple logic

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "users", label: "Users", icon: <Users size={18} /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquare size={18} />, badge: 3 },
  { id: "support", label: "Support", icon: <HeadphonesIcon size={18} />, badge: 5 },
  { id: "errors", label: "Errors", icon: <AlertTriangle size={18} />, badge: 2 },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
]

export default function Sidebar({ activeSection, onSectionChange, notificationCount = 0 }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">
            <Shield size={16} color="white" />
          </div>
          <div className="logo-text">
            <h1>Admin Panel</h1>
            <span>Management System</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          <div className="nav-list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              const showBadge = item.id === "notifications" ? notificationCount > 0 : item.badge
              const badgeCount = item.id === "notifications" ? notificationCount : item.badge

              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {showBadge && (
                    <span className="nav-badge">{badgeCount}</span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="user-menu">
          <button className="user-btn">
            <div className="avatar">
               <img src="/placeholder.svg?height=28&width=28" alt="Admin" />
            </div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Super Admin</span>
            </div>
            <ChevronDown size={14} className="text-muted" />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
        }
        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text h1 {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          font-family: var(--font-inter);
        }
        .logo-text span {
          font-size: 10px;
          color: var(--text-muted);
          display: block;
        }
        .nav-list {
          display: flex;
          background: #f3f4f6;
          padding: 4px;
          border-radius: 8px;
        }
        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 6px;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .nav-item.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .nav-item:hover:not(.active) {
          color: var(--text-main);
        }
        .nav-badge {
          background: #ef4444;
          color: white;
          font-size: 9px;
          font-weight: bold;
          height: 16px;
          min-width: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          padding: 0 4px;
        }
        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: pointer;
        }
        .user-btn:hover {
          background: #f3f4f6;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .user-name { font-size: 13px; font-weight: 500; }
        .user-role { font-size: 10px; color: var(--text-muted); }
      `}</style>
    </header>
  )
}