import React from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  AlertTriangle,
  Bell,
  HeadphonesIcon,
  Shield,
  LogOut,
  Menu, // Icon hamburger cho mobile
  X,    // Icon đóng menu
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "users", label: "Users", icon: <Users size={18} /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquare size={18} />},
  { id: "support", label: "Support", icon: <HeadphonesIcon size={18} />},
  { id: "errors", label: "Errors", icon: <AlertTriangle size={18} />},
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
];

export default function Sidebar({ activeSection, onSectionChange, notificationCount = 0 }) {
  // State quản lý đóng mở menu trên màn hình điện thoại
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const handleLogout = () => {
    console.log("Đã bấm logout!");
    localStorage.removeItem("my_username");
    window.location.href = "/signin";
  }
  return (
    // Thanh điều hướng chính
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. LOGO (Bên trái) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <Shield size={18} />
            </div>
            <div className="hidden md:flex flex-col">
              <h1 className="text-sm font-bold leading-tight text-gray-900">Admin Panel</h1>
              <span className="text-[10px] font-semibold tracking-wide text-gray-500">MANAGEMENT</span>
            </div>
          </div>

          {/* 2. MENU ITEMS (Ở giữa - Chỉ hiện trên màn hình lớn > md) */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const badgeCount = item.id === "notifications" ? notificationCount : item.badge;

              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className={isActive ? "text-blue-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  
                  {/* Badge số lượng */}
                  {badgeCount > 0 && (
                    <span className={`ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. USER INFO & ACTIONS (Bên phải) */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4">
               <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">{localStorage.getItem("my_username")}</p>
               </div>
               <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                  AD
               </div>
            </div>

            {/* Logout Button (Desktop) */}
            <button className="hidden sm:flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sign out"
            onClick={handleLogout}>
               <LogOut size={20} />
            </button>

            {/* Nút mở menu Mobile (Chỉ hiện khi màn hình nhỏ) */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-2 py-3 space-y-1 shadow-lg absolute w-full left-0 z-50">
           {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                      onSectionChange(item.id);
                      setIsMobileOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                  </div>
                </button>
              );
           })}
        </div>
      )}
    </nav>
  );
}