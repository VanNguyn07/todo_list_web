import React from "react";
// Cần cài đặt: npm install lucide-react recharts
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useFetchUsers } from "../../../hooks/useFetchUsers";
// --- Helper Components ---
const Card = ({ children, className }) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm hover:shadow-md transition-all duration-300 ${
      className || ""
    }`}
  >
    {children}
  </div>
);

// --- Dữ liệu biểu đồ ---
const chartData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1900 },
  { month: "Mar", users: 1500 },
  { month: "Apr", users: 2500 },
  { month: "May", users: 1800 },
  { month: "Jun", users: 2800 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-50">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-lg font-bold text-blue-600">
          {payload[0].value.toLocaleString()} users
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardOverview() {
  const { users } = useFetchUsers();
  const totalUsers = users?.length || 0;
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "#2563eb",
      bg: "#eff6ff",
      borderColor: "border-l-4 border-l-blue-500",
      accentColor: "text-blue-600",
    },
    {
      title: "Active Issues",
      value: "14",
      change: "-5%",
      isPositive: true,
      icon: AlertTriangle,
      color: "#d97706",
      bg: "#fffbeb",
      borderColor: "border-l-4 border-l-amber-500",
      accentColor: "text-amber-600",
    },
    {
      title: "Feedback Received",
      value: "5",
      change: "+8%",
      isPositive: true,
      icon: MessageSquare,
      color: "#9333ea",
      bg: "#faf5ff",
      borderColor: "border-l-4 border-l-purple-500",
      accentColor: "text-purple-600",
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "-0.5%",
      isPositive: false,
      icon: Activity,
      color: "#16a34a",
      bg: "#f0fdf4",
      borderColor: "border-l-4 border-l-green-500",
      accentColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h2>
        <p className="text-base text-gray-600">
          Welcome back! Here's a comprehensive overview of your platform
          performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`p-6 ${stat.borderColor} overflow-hidden group hover:border-gray-300`}
          >
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 block mb-3">
                  {stat.title}
                </span>
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${stat.accentColor}`}>
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs font-medium">
                    <span
                      className={`flex items-center ${
                        stat.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.isPositive ? (
                        <ArrowUpRight size={14} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={14} className="mr-1" />
                      )}
                      {stat.change}
                    </span>
                    <span className="ml-2 text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
              <div
                className="rounded-lg p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon size={28} style={{ color: stat.color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* THAY ĐỔI Ở ĐÂY: lg:col-span-7 để chiếm hết chiều ngang */}
        <Card className="lg:col-span-7 overflow-hidden flex flex-col shadow-sm border-gray-200">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                User Growth Statistics
              </h3>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              Tracking monthly active users over the last 6 months period
            </p>
          </div>

          <div className="flex-1 w-full p-6 min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                  }
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#3b82f6",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 4",
                  }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  activeDot={{
                    r: 6,
                    stroke: "#2563eb",
                    strokeWidth: 4,
                    fill: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
