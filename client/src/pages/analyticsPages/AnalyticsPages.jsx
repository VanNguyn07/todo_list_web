import React from "react";
import "./AnalyticsPages.css"; // Import file CSS vừa tạo
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Target, Clock, Zap, Flame } from "lucide-react";

/* --- 1. MOCK DATA (DỮ LIỆU GIẢ LẬP) --- */

// Dữ liệu Focus (Area Chart)
const dataFocus = [
  { time: '6 AM', minutes: 0 },
  { time: '9 AM', minutes: 45 },
  { time: '12 PM', minutes: 30 },
  { time: '3 PM', minutes: 90 },
  { time: '6 PM', minutes: 60 },
  { time: '9 PM', minutes: 120 },
  { time: '11 PM', minutes: 30 }
]

// Dữ liệu Habits (Radar Chart)
const dataHabits = [
  { subject: 'Health', A: 120, fullMark: 150 },
  { subject: 'Coding', A: 140, fullMark: 150 },
  { subject: 'Reading', A: 90, fullMark: 150 },
  { subject: 'Meditation', A: 60, fullMark: 150 },
  { subject: 'English', A: 110, fullMark: 150 },
];

// Dữ liệu Burn-down (Line Chart - QUAN TRỌNG)
const dataBurndown = [
  { day: 'Mon', ideal: 20, actual: 20 },
  { day: 'Tue', ideal: 17, actual: 18 },
  { day: 'Wed', ideal: 13, actual: 14 },
  { day: 'Thu', ideal: 10, actual: 8 },
  { day: 'Fri', ideal: 6, actual: 5 },
  { day: 'Sat', ideal: 3, actual: 2 },
  { day: 'Sun', ideal: 0, actual: 0 },
];

// Dữ liệu Balance (Donut Chart)
const dataBalance = [
  { name: 'Work', value: 55, color: '#6366f1' },
  { name: 'Study', value: 30, color: '#f59e0b' },
  { name: 'Personal', value: 15, color: '#10b981' },
];

// Dữ liệu Upcoming (Stacked Bar Chart)
const dataUpcoming = [
  { day: 'Mon', urgent: 2, normal: 3 },
  { day: 'Tue', urgent: 1, normal: 5 },
  { day: 'Wed', urgent: 4, normal: 2 },
  { day: 'Thu', urgent: 0, normal: 4 },
  { day: 'Fri', urgent: 2, normal: 2 },
];

/* --- 2. SUB-COMPONENTS --- */

// Component thẻ KPI nhỏ gọn
const KPICard = ({ title, value, icon, trend, isUp, bgClass }) => (
  <div className="card-kpi">
    <div className="kpi-top">
      <div className={`icon-box ${bgClass}`}>{icon}</div>
      <span className={`badge ${isUp ? "badge-up" : "badge-down"}`}>
        {trend}
      </span>
    </div>
    <h3 className="kpi-stat">{value}</h3>
    <p className="kpi-label">{title}</p>
  </div>
);

/* --- 3. MAIN DASHBOARD COMPONENT --- */

export const AnalyticsPages = () => {
  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <i className="fa-solid fa-chart-pie"></i>
          <h1 className="text-title">Analytics Overview</h1>
        </div>
        <p className="dashboard-subtitle">
          Track your weekly progress, focus metrics, and personal growth.
        </p>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <div className="grid-kpi">
        <KPICard
          title="Task Completed"
          value="42"
          trend="+12%"
          isUp={true}
          icon={<Target size={24} />}
          bgClass="bg-indigo-light"
        />
        <KPICard
          title="Daily Focus Time"
          value="18.5h"
          trend="-2%"
          isUp={false}
          icon={<Clock size={24} />}
          bgClass="bg-rose-light"
        />
        <KPICard
          title="Performance"
          value="94%"
          trend="+5%"
          isUp={true}
          icon={<Zap size={24} />}
          bgClass="bg-amber-light"
        />
        <KPICard
          title="Current Streak"
          value="12 days"
          trend="On Fire!"
          isUp={true}
          icon={<Flame size={24} />}
          bgClass="bg-emerald-light"
        />
      </div>

      {/* SECTION 2: FOCUS AREA & HABIT RADAR */}
      <div className="grid-focus-habit">
        {/* Left: Focus Chart */}
        <div className="card-focus-time">
          <div className="card-header">
            <h3 className="card-title">Peak Focus Hours</h3>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataFocus}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFocus)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Habit Radar */}
        <div className="card-habit-radar">
          <div className="card-header">
            <h3 className="card-title">Habit Tracker</h3>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dataHabits}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Điểm số"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3: BURN-DOWN CHART (Tiến độ dự án) */}
      <div className="grid-burndown">
        <div className="card-burn-down">
          <div className="card-header">
            <h3 className="card-title">
              Weekly Burn-down Chart
            </h3>
            <div style={{ fontSize: "14px", color: "#64748b" }}>
              <span style={{ color: "#94a3b8", marginRight: "10px" }}>
                -- Ideal Plan
              </span>
              <span style={{ color: "#f43f5e", fontWeight: "bold" }}>
                ● Actual Progress
              </span>
            </div>
          </div>
          <div className="chart-box-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataBurndown}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none" }}
                />
                {/* Đường kế hoạch (Nét đứt, màu xám) */}
                <Line
                  type="monotone"
                  dataKey="ideal"
                  name="Kế hoạch"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
                {/* Đường thực tế (Nét liền, màu đỏ) */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Thực tế còn lại"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 4: BALANCE & UPCOMING */}
      <div className="grid-balance-upcoming">
        {/* Left: Life Balance */}
        <div className="card-balance">
          <div className="card-header">
            <h3 className="card-title">Life Balance</h3>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataBalance}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataBalance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Upcoming Stacked Bar */}
        <div className="card-upcoming">
          <div className="card-header">
            <h3 className="card-title">Upcoming Workload</h3>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataUpcoming} barSize={60}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "8px", border: "none" }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Bar
                  dataKey="urgent"
                  name="Urgent"
                  stackId="a"
                  fill="#f70029ff"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="normal"
                  name="Normal"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
