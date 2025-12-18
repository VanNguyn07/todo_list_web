"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import DashboardOverview from "@/components/dashboard-overview"
import UserManagement from "@/components/user-management"
import FeedbackSupport from "@/components/feedback-support"
import SupportTickets from "@/components/support-tickets"
import SystemErrors from "@/components/system-errors"
import Notifications from "@/components/notifications"

export default function Page() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [notificationCount, setNotificationCount] = useState(0)

  const handleNotificationSent = () => {
    setNotificationCount((prev) => prev + 1)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "users":
        return <UserManagement />
      case "feedback":
        return <FeedbackSupport />
      case "support":
        return <SupportTickets />
      case "errors":
        return <SystemErrors />
      case "notifications":
        return <Notifications onNotificationSent={handleNotificationSent} />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="main-layout">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} notificationCount={notificationCount} />
      <main className="container">
        {renderContent()}
      </main>
    </div>
  )
}