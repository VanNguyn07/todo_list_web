import React, { useState } from "react";
import Layout from "./layout";
import Sidebar from "../components/sidebar";
import DashboardOverview from "../components/dashboard-overview";
import UserManagement from "../components/user-management";
import FeedbackSupport from "../components/feedback-support";
import SupportTickets from "../components/support-tickets";
import SystemErrors from "../components/system-errors";
import Notifications from "../components/notifications";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [notificationCount, setNotificationCount] = useState(0)

  const handleNotificationSent = () => {
    setNotificationCount((prev) => prev + 1)
  }

  // Hàm điều hướng hiển thị nội dung dựa trên tab đang chọn
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        // Bạn cần đảm bảo đã có file dashboard-overview.jsx trong thư mục components
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
    <Layout>
      {/* Top Navigation Bar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        notificationCount={notificationCount} 
      />

      {/* Main Content Area */}
      <main className="w-full h-screen overflow-y-auto bg-gray-50 pt-16">
        <div className="mx-auto max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </Layout>
  )
}