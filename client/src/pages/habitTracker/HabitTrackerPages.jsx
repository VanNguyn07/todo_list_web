import React, { useState, useEffect } from "react";
import "./HabitTrackPages.css"; // Import file CSS
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
import { useHabitPages } from "../../hooks/useHabitPages";

export const HabitTrackerPages = () => {
  const {
    // Data hiển thị
    habits,
    // Logic Page (Tiến độ, Xóa)
    handleIncrement,
    handleDeleteHabit,
    // Logic Manager (Modal, Add, Edit)
    isModalOpen,
    editingId,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    // Logic Form (Input)
    habitForm,
    setHabitForm,
    handleInputChange,
    handleChangePeriod,
    handleChangetarget,
    handleChangeUnit,
    handleChangeIconMap,
    iconColorMap,
  } = useHabitPages();
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
  // const safeHabits = Array.isArray(habits) ? habits : [];

  const totalHabits = habits.length;

  // Tính trung bình % hoàn thành của tất cả habit
  const totalPercent = habits.reduce(
    (acc, h) => acc + Math.min(h.current / h.target, 1),
    0
  );
  const overallProgress =
    totalHabits === 0 ? 0 : Math.round((totalPercent / totalHabits) * 100);

  // Suggestions Data
  const suggestions = [
    {
      name: "Meditation",
      period: "Daily",
      iconKey: "sport",
      color: "var(--color-blue)",
      bgClass: "bg-light-blue",
    },
    {
      name: "Yoga",
      period: "Weekly",
      iconKey: "gym",
      color: "var(--color-red-pink)",
      bgClass: "bg-light-red",
    },
    {
      name: "Tennis",
      period: "Weekly",
      iconKey: "sport",
      color: "var(--color-orange)",
      bgClass: "bg-light-orange",
    },
    {
      name: "Healthy Food",
      period: "Daily",
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
        </div>

        <div className="habit-list-container">
          {habits.map((habit) => {
            const current = parseFloat(habit.current);
            const target = parseFloat(habit.target);

            const percent =
              target > 0 ? Math.min((current / target) * 100, 100) : 0;
            const keyToRender = habit.icon_key || habit.iconKey || "default";

            const isCompleted = habit.completed === "true";

            const cardColor = iconColorMap[keyToRender] || iconColorMap.default;

            return (
              <div
                key={habit.id}
                className="habit-card"
                style={{
                  backgroundColor: isCompleted ? "#8a8686ff" : cardColor,
                }}
              >
                <div
                  className="habit-icon-box"
                  style={
                    isCompleted
                      ? { background: "gray", color: "#b8b6b6ff" }
                      : { color: "white" }
                  }
                >
                  {/* Render Icon từ Map với fallback */}
                  {iconMap[keyToRender] || iconMap["default"]}
                </div>

                <div
                  className="habit-info"
                  style={{
                    flex: 1,
                    paddingRight: "20px",
                    color: isCompleted ? "#1e1e2d" : "white",
                  }}
                >
                  <h3 className={isCompleted ? "completed-text" : ""}>
                    {habit.name}
                  </h3>
                  <div className="habit-meta">
                    <span>
                      {Number(current)} / {Number(target)} {habit.unit}
                    </span>
                    <span>{habit.period}</span>
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
                setHabitForm({
                  ...habitForm,
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
              <p>{item.period}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Habit" : "New Habit Goal"}</h2>
              <button className="btn-close" onClick={() => closeModal()}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Habit Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Read Book"
                value={habitForm.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Goal Period</label>
              <div style={{ position: "relative" }}>
                <select
                  className="form-input"
                  name="period"
                  value={habitForm.period}
                  onChange={(e) => handleChangePeriod(e.target.value)}
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
                  Target ({habitForm.target})
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 5"
                    name="target"
                    value={habitForm.target}
                    onChange={handleChangetarget}
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
                  name="unit"
                  value={habitForm.unit}
                  onChange={(e) => handleChangeUnit(e.target.value)}
                >
                  <option value="" disabled>
                    Select Unit
                  </option>
                  <optgroup label="Distance">
                    <option value="km">km (Kilometer)</option>
                    <option value="m">m (Meter)</option>
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
            <div className="form-group">
              <label className="form-label">Icon</label>

              <div className="icon-selector">
                {Object.keys(iconMap).map((key) => {
                  const isSelected = habitForm.iconKey === key;
                  const color = iconColorMap[key] || iconColorMap.default;

                  return (
                    <div
                      key={key}
                      className={`icon-opt ${isSelected ? "selected" : ""}`}
                      onClick={() => handleChangeIconMap(key)}
                      style={{
                        // Nếu chọn: nền màu, chữ trắng. Không chọn: nền trong suốt, chữ màu
                        backgroundColor: isSelected ? color : "transparent",
                        color: isSelected ? "white" : color,
                        borderColor: isSelected ? color : "#e5e7eb", // Viền trùng màu
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      {iconMap[key]}
                    </div>
                  );
                })}
              </div>
              <input type="hidden" name="iconKey" value={habitForm.iconKey} />
            </div>

            <div className="modal-footer">
              <button className="btn-submit" onClick={handleSubmit}>
                {editingId ? "Update Goal" : "Set Goal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
