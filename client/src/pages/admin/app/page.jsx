import React, { useState } from "react";
import Layout from "./layout"; // Đảm bảo đường dẫn import đúng
import Sidebar from "../components/sidebar"; // Dù tên là Sidebar nhưng giờ nó là Topbar
import DashboardOverview from "../components/dashboard-overview";
import UserManagement from "../components/user-management";
import FeedbackSupport from "../components/feedback-support";
import SupportTickets from "../components/support-tickets";
import SystemErrors from "../components/system-errors";
import Notifications from "../components/notifications";

// Import file CSS (đã sửa ở bước trước với reset box-sizing)
import "./admin.css";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notificationCount, setNotificationCount] = useState(0);

  const handleNotificationSent = () => {
    setNotificationCount((prev) => prev + 1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UserManagement />;
      case "feedback":
        return <FeedbackSupport />;
      case "support":
        return <SupportTickets />;
      case "errors":
        return <SystemErrors />;
      case "notifications":
        return <Notifications onNotificationSent={handleNotificationSent} />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Layout>
      <div
        id="admin-app"
        className="flex flex-col h-screen w-full overflow-hidden bg-gray-50 text-gray-900"
      >
        <header className="w-full flex-shrink-0 z-50 bg-white shadow-sm relative">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            notificationCount={notificationCount}
          />
        </header>
        <main className="flex-1 overflow-y-auto relative scroll-smooth">
          <div className="mx-auto max-w-7xl p-6">{renderContent()}</div>
        </main>
      </div>
    </Layout>
  );
}
