import React, { useState, useEffect } from "react";
import "./HabitTrackPages.css"; // Import file CSS
import confetti from "canvas-confetti";
import {
  CloudSun,
  Check,
  Play,
  RotateCcw,
  Pause,
  X,
  Plus,
  Target,
  CalendarDays,
  Pencil,
  Trash2,
  Footprints,
  Droplets,
  BookOpen,
  Moon,
  Dumbbell,
  Trophy,
  Utensils,
  Briefcase,
  Music,
  Flame,
  Crown,
} from "lucide-react";

export const HabitTrackerPages = () => {
  //   const [activeDate, setActiveDate] = useState(new Date().getDate());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID của habit đang sửa

  // Mapping String Key sang Lucide Component
  const iconMap = {
    run: <Footprints size={24} />,
    water: <Droplets size={24} />,
    book: <BookOpen size={24} />,
    sleep: <Moon size={24} />,
    gym: <Dumbbell size={24} />,
    sport: <Trophy size={24} />,
    food: <Utensils size={24} />,
    work: <Briefcase size={24} />,
    music: <Music size={24} />,
  };

  // Dữ liệu mẫu
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Jogging",
      freq: "Daily",
      current: 3,
      target: 5,
      unit: "km",
      iconKey: "run",
      color: "var(--color-blue)",
      completed: false,
    },
    {
      id: 2,
      name: "Drink Water",
      freq: "Daily",
      current: 4,
      target: 8,
      unit: "cups",
      iconKey: "water",
      color: "var(--color-cyan)",
      completed: false,
    },
    {
      id: 3,
      name: "Read Books",
      freq: "Daily",
      current: 15,
      target: 30,
      unit: "mins",
      iconKey: "book",
      color: "var(--color-orange)",
      completed: false,
    },
    {
      id: 4,
      name: "Sleep",
      freq: "Daily",
      current: 7,
      target: 8,
      unit: "hrs",
      iconKey: "sleep",
      color: "var(--color-purple)",
      completed: false,
    },
  ]);

  const [newHabitData, setNewHabitData] = useState({
    name: "",
    iconKey: "run",
    period: "Daily",
    target: "",
    unit: "",
  });

  // --- LOGIC: Tạo danh sách ngày tự động (Tuần hiện tại) ---
  const getDaysArray = () => {
    const days = [];
    const today = new Date();
    // Tạo 7 ngày: 3 ngày trước hôm nay, hôm nay, 3 ngày sau
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push({
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: d.getDate(),
        fullDate: d.toDateString(),
        isToday: i === 0,
      });
    }
    return days;
  };
  const weekDays = getDaysArray();

  // --- LOGIC: Tính toán Tiến độ ---
  const totalHabits = habits.length;
  // Tính trung bình % hoàn thành của tất cả habit
  const totalPercent = habits.reduce(
    (acc, h) => acc + Math.min(h.current / h.target, 1),
    0
  );
  const overallProgress =
    totalHabits === 0 ? 0 : Math.round((totalPercent / totalHabits) * 100);

  // Xử lý nút bấm tăng
  const handleIncrement = (id) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          if (habit.current < habit.target) {
            const newCurrent = habit.current + 1;
            const isDone = newCurrent >= habit.target;
            if (isDone) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#4690ff", "#ff5c72"],
              });
            }
            return { ...habit, current: newCurrent, completed: isDone };
          }
        }
        return habit;
      })
    );
  };

  const handleDeleteHabit = (id) => {
    if (window.confirm("Delete this habit?")) {
      setHabits(habits.filter((h) => h.id !== id));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setNewHabitData({
      name: "",
      iconKey: "run",
      period: "Daily",
      target: "",
      unit: "",
    });
    setShowModal(true);
  };

  const openEditModal = (habit) => {
    setEditingId(habit.id);
    setNewHabitData({
      name: habit.name,
      iconKey: habit.iconKey,
      target: habit.target,
      unit: habit.unit,
      period: habit.freq.includes("Weekly")
        ? "Weekly"
        : habit.freq.includes("Monthly")
        ? "Monthly"
        : "Daily",
    });
    setShowModal(true);
  };

  const handleSaveHabit = () => {
    if (!newHabitData.name || !newHabitData.target) return;

    let dailyTarget = parseFloat(newHabitData.target);
    let displayFreq = "Daily";
    if (newHabitData.period === "Weekly") {
      dailyTarget = Math.ceil(dailyTarget / 7);
      displayFreq = "Weekly Goal";
    } else if (newHabitData.period === "Monthly") {
      dailyTarget = Math.ceil(dailyTarget / 30);
      displayFreq = "Monthly Goal";
    }

    if (editingId) {
      setHabits(
        habits.map((h) => {
          if (h.id === editingId) {
            return {
              ...h,
              name: newHabitData.name,
              iconKey: newHabitData.iconKey,
              target: dailyTarget,
              unit: newHabitData.unit,
              freq: displayFreq,
            };
          }
          return h;
        })
      );
    } else {
      const colors = [
        "var(--color-blue)",
        "var(--color-orange)",
        "var(--color-purple)",
        "var(--color-red-pink)",
        "var(--color-green)",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabitData.name,
          freq: displayFreq,
          target: dailyTarget,
          current: 0,
          unit: newHabitData.unit,
          iconKey: newHabitData.iconKey,
          color: randomColor,
          completed: false,
        },
      ]);
    }
    setShowModal(false);
  };

  // Suggestions Data
  const suggestions = [
    {
      name: "Meditation",
      freq: "Daily",
      iconKey: "sport",
      color: "var(--color-blue)",
      bgClass: "bg-light-blue",
    },
    {
      name: "Yoga",
      freq: "Weekly",
      iconKey: "gym",
      color: "var(--color-red-pink)",
      bgClass: "bg-light-red",
    },
    {
      name: "Tennis",
      freq: "Weekly",
      iconKey: "sport",
      color: "var(--color-orange)",
      bgClass: "bg-light-orange",
    },
    {
      name: "Healthy Food",
      freq: "Daily",
      iconKey: "food",
      color: "var(--color-green)",
      bgClass: "bg-light-purple",
    },
  ];

  // Focus Timer Component
  const FocusTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    useEffect(() => {
      let interval = null;
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      } else if (timeLeft === 0) {
        setIsRunning(false);
      }
      return () => clearInterval(interval);
    }, [isRunning, timeLeft]);
    const formatTime = (s) =>
      `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
    return (
      <div className="widget-timer">
        <div className="timer-header">
          <span style={{ fontSize: "20px" }}>🍅</span>
          <h4 style={{ margin: 0, color: "#1e1e2d" }}>Focus Mode</h4>
        </div>
        <div className="timer-text-habit">{formatTime(timeLeft)}</div>
        <div className="timer-actions-habit">
          <button
            className="btn-control reset"
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(25 * 60);
            }}
          >
            <RotateCcw size={18} />
          </button>
          <button
            className="btn-control play"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <Pause size={18} fill="white" />
            ) : (
              <Play size={18} fill="white" style={{ marginLeft: "2px" }} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="habit-page-container">
      {/* --- CỘT GIỮA: NỘI DUNG CHÍNH --- */}
      <main className="habit-main-section">
        <div className="habit-header">
          <div className="header-title-group">
            <h1 className="header-title">
              <Crown size={50} />
              Own Your Day
            </h1>
            <p className="header-subtitle">Let's make today productive!</p>
          </div>
          <div className="weather-widget">
            <CloudSun size={24} color="#ff9f69" />{" "}
            <span style={{ fontSize: "18px" }}>28°C</span>
          </div>
        </div>

        {/* Date Strip tự động */}
        <div className="date-strip">
          {weekDays.map((item) => (
            <div
              key={item.fullDate}
              className={`date-item ${item.isToday ? "active" : ""}`}
            >
              <span className="date-day">{item.dayName}</span>
              <span className="date-num">{item.dayNumber}</span>
            </div>
          ))}
        </div>

        <div className="section-header">
          <span>Upcoming Habits</span>
          <a className="link-manage" href="#">
            Manage
          </a>
        </div>

        <div className="habit-list-container">
          {habits.map((habit) => {
            const percent =
              habit.target > 0
                ? Math.min((habit.current / habit.target) * 100, 100)
                : 0;
            const isCompleted = habit.completed;

            return (
              <div
                key={habit.id}
                className="habit-card"
                style={{
                  backgroundColor: isCompleted ? "#595959ff" : habit.color,
                }}
              >
                <div
                  className="habit-icon-box"
                  style={
                    isCompleted
                      ? { background: "white", color: "#ccc" }
                      : { color: "white" }
                  }
                >
                  {/* Render Icon từ Map */}
                  {iconMap[habit.iconKey]}
                </div>

                <div
                  className="habit-info"
                  style={{
                    flex: 1,
                    paddingRight: "20px",
                    color: isCompleted ? "#1e1e2d" : "white",
                  }}
                >
                  <h3>{habit.name}</h3>
                  <div className="habit-meta">
                    <span>
                      {habit.current} / {habit.target} {habit.unit}
                    </span>
                    <span>{habit.freq}</span>
                  </div>
                  <div
                    className="progress-bar-mini"
                    style={{
                      background: isCompleted ? "#e5e7eb" : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      className="progress-fill-mini"
                      style={{
                        width: `${percent}%`,
                        background: isCompleted ? "#10b981" : "white",
                      }}
                    ></div>
                  </div>
                </div>

                <div
                  className={`btn-progress-circle ${
                    isCompleted ? "completed" : ""
                  }`}
                  onClick={() => handleIncrement(habit.id)}
                  style={
                    !isCompleted
                      ? {
                          background: `conic-gradient(white ${percent}%, rgba(255,255,255,0.3) 0)`,
                        }
                      : {}
                  }
                >
                  <div className="progress-icon-center">
                    {isCompleted ? (
                      <Check size={20} strokeWidth={4} />
                    ) : (
                      <Plus size={20} strokeWidth={4} />
                    )}
                  </div>
                </div>
                {/* Nút Sửa/Xóa */}
                <div className="card-actions-habit">
                  <button
                    className="action-btn-small edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(habit);
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  
                  <button
                    className="action-btn-small delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHabit(habit.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- CỘT PHẢI: WIDGETS --- */}
      <aside className="habit-right-panel">
        <div className="section-header">
          <span>Daily Progress</span>
        </div>

        {/* Progress Widget */}
        <div className="widget-progress">
          <div className="wp-header">
            <div className="wp-icon">
              <Flame size={30} />
            </div>
            <div className="wp-info">
              <h3>Overall</h3>
              <div className="wp-bar-bg">
                <div
                  className="wp-bar-fill"
                  style={{ width: `${overallProgress}%` }}
                ></div>
                <div className="wp-badge">{overallProgress}% Done</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-header" style={{ marginTop: "10px" }}>
          <span>Focus Time</span>
        </div>
        <FocusTimer />

        <div className="create-header" style={{ marginBottom: "15px" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--text-dark)",
            }}
          >
            Create Habits
          </span>
          <button className="btn-add-habit" onClick={openCreateModal}>
            <Plus size={14} /> Add New
          </button>
        </div>

        <div className="suggestion-grid">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className={`suggestion-card ${item.bgClass}`}
              onClick={() => {
                setNewHabitData({
                  ...newHabitData,
                  name: item.name,
                  iconKey: item.iconKey,
                });
                openCreateModal();
              }}
            >
              <div
                className="sug-icon"
                style={{ backgroundColor: "white", color: item.color }}
              >
                {iconMap[item.iconKey]}
              </div>
              <h4>{item.name}</h4>
              <p>{item.freq}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Habit" : "New Habit Goal"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Habit Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Read Book"
                value={newHabitData.name}
                onChange={(e) =>
                  setNewHabitData({ ...newHabitData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Goal Period</label>
              <div style={{ position: "relative" }}>
                <select
                  className="form-input"
                  value={newHabitData.period}
                  onChange={(e) =>
                    setNewHabitData({ ...newHabitData, period: e.target.value })
                  }
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <CalendarDays
                  size={18}
                  color="#9ca3af"
                  style={{
                    position: "absolute",
                    right: "40px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div className="form-group">
                <label className="form-label">
                  Target ({newHabitData.period})
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 5"
                    value={newHabitData.target}
                    onChange={(e) =>
                      setNewHabitData({
                        ...newHabitData,
                        target: e.target.value,
                      })
                    }
                    style={{ paddingLeft: "40px" }}
                  />
                  <Target
                    size={18}
                    color="#9ca3af"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
              </div>
              {/* Unit Select Option theo yêu cầu */}
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  className="form-input"
                  value={newHabitData.unit}
                  onChange={(e) =>
                    setNewHabitData({ ...newHabitData, unit: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Unit
                  </option>
                  <optgroup label="Distance">
                    <option value="km">km (Kilometer)</option>
                    <option value="m">m (Meter)</option>
                    <option value="miles">miles</option>
                  </optgroup>
                  <optgroup label="Time">
                    <option value="mins">mins (Minutes)</option>
                    <option value="hrs">hrs (Hours)</option>
                  </optgroup>
                  <optgroup label="Quantity">
                    <option value="times">times</option>
                    <option value="cups">cups</option>
                    <option value="pages">pages</option>
                    <option value="sess">sessions</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {newHabitData.target && newHabitData.period !== "Daily" && (
              <div
                style={{
                  background: "#f0f9ff",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  color: "#0369a1",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "bold" }}>💡 Auto-Split:</div>~{" "}
                <strong>
                  {Math.ceil(
                    newHabitData.target /
                      (newHabitData.period === "Weekly" ? 7 : 30)
                  )}{" "}
                  {newHabitData.unit}
                </strong>{" "}
                per day.
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Icon</label>
              <div className="icon-selector">
                {Object.keys(iconMap).map((key) => (
                  <div
                    key={key}
                    className={`icon-opt ${
                      newHabitData.iconKey === key ? "selected" : ""
                    }`}
                    onClick={() =>
                      setNewHabitData({ ...newHabitData, iconKey: key })
                    }
                  >
                    {iconMap[key]}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-submit" onClick={handleSaveHabit}>
                {editingId ? "Update Goal" : "Set Goal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
