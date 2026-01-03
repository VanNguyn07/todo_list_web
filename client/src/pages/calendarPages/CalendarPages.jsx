import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import { format, isSameDay } from "date-fns";
import {} from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import "./CalendarPages.css";

// 1. IMPORT ICONS TỪ LUCIDE-REACT
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle,
  RotateCcw,
  Trash2,
  X,
  Pen,
} from "lucide-react";
import { useCalendarManager } from "../../hooks/useCalendarManager";
import { useFetchEvent } from "../../hooks/useFetchCalendar";

export const CalendarPages = () => {
  const { events, refetch } = useFetchEvent();
  const [date, setDate] = useState(new Date());
  console.log("1. Dữ liệu events từ Hook:", events);
  const {
    handleChangeColor,
    handleChangeInput,
    handleSubmit,
    handleToggleEvent,
    handleDeleteEvent,
    isModalOpen,
    colors,
    editingId,
    calForm,
    // setCalForm,
    openAddModal,
    openUpdateModal,
    closeModal,
  } = useCalendarManager({ onSuccess: refetch, date: date });

  // --- LOGIC ---
  const eventsMap = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      const dateKey = format(new Date(event.date), "yyyy-MM-dd");
      if (!map[dateKey])
        map[dateKey] = { count: 0, completed: 0, isAllDone: false };
      map[dateKey].count += 1;
      if (event.completed) map[dateKey].completed += 1;
    });
    Object.keys(map).forEach((key) => {
      map[key].isAllDone =
        map[key].count > 0 && map[key].count === map[key].completed;
    });
    return map;
  }, [events]);

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = format(date, "yyyy-MM-dd");
      const data = eventsMap[dateKey];
      if (data && data.count > 0) {
        const statusClass = data.isAllDone ? "cp-done" : "";
        if (data.count === 1)
          return <div className={`cp-dot ${statusClass}`}></div>;
        return <div className={`cp-badge ${statusClass}`}>{data.count}</div>;
      }
    }
    return null;
  };

  const currentEvent = events
    .filter((t) => {
      // 2. Thử convert sang Date Object để so sánh
      const taskDateObj = new Date(t.date);
      const isMatch = isSameDay(taskDateObj, date);

      // 3. Trả về kết quả (Quan trọng: Phải convert t.date thì mới True được)
      return isMatch;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalToday = currentEvent.length;
  const completedToday = currentEvent.filter((t) => t.completed).length;
  const progress =
    totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  return (
    <div className="cp-wrapper">
      {/* HEADER */}
      <header className="cp-header">
        <div className="cp-header-title">
          <CalendarDays size={50} />
          <p>My Calendar</p>
        </div>
        <div className="cp-header-subtitle">
          <p>Task Management & Schedule</p>
        </div>
      </header>

      <div className="cp-body">
        {/* SIDEBAR TRÁI */}
        <aside className="cp-sidebar">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={getTileContent}
            locale="en-US"
            showFixedNumberOfWeeks={true}
          />

          <div className="cp-stats">
            <div className="cp-stats-head">
              <span>Daily Progress</span>
              <span>
                {completedToday}/{totalToday} Tasks
              </span>
            </div>
            <div className="cp-progress-track">
              <div
                className="cp-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {progress === 100
                ? "🎉 Amazing! You crushed it!"
                : "Stay focused, almost there!"}
            </div>
          </div>
        </aside>

        {/* NỘI DUNG PHẢI */}
        <main className="cp-content">
          <div className="cp-top-bar">
            <div className="cp-date-heading">
              <h2>{format(date, "MMMM do, yyyy")}</h2>
              <span>{format(date, "EEEE")}</span>
            </div>

            <button className="cp-btn-add" onClick={openAddModal}>
              <Plus size={20} /> Add Event
            </button>
          </div>

          <div className="cp-task-list">
            {currentEvent.length > 0 ? (
              currentEvent.map((event) => (
                <div key={event.id} className="cp-task-row">
                  {/* Cột thời gian */}
                  <div className="cp-time-col">
                    <span className="cp-time-start">{event.startTime}</span>
                    <span className="cp-time-end">{event.endTime}</span>
                  </div>

                  {/* Card Task */}
                  <div
                    className={`cp-task-card ${
                      event.completed ? "completed" : ""
                    }`}
                    style={{ borderLeftColor: event.color }}
                  >
                    <div className="cp-task-info">
                      <h4>{event.name}</h4>
                      {event.description && <p>{event.description}</p>}
                    </div>

                    {/* Hover Actions */}
                    <div className="cp-task-actions">
                      <button
                        className="cp-btn-icon"
                        title={event.completed ? "Undo" : "Complete"}
                        onClick={() => handleToggleEvent(event.id)}
                      >
                        {event.completed ? (  
                          <RotateCcw size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </button>

                      <button
                        className="cp-btn-icon cp-btn-del"
                        onClick={() => openUpdateModal(event)}
                        title="Update"
                      >
                        <Pen size={18} />
                      </button>

                      <button
                        className="cp-btn-icon cp-btn-del"
                        onClick={() => handleDeleteEvent(event.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "60px",
                  color: "#94a3b8",
                }}
              >
                <Clock
                  size={48}
                  style={{ opacity: 0.2, marginBottom: "16px" }}
                />
                <p>No tasks scheduled for today.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="cp-modal-overlay" onClick={closeModal}>
          <div className="cp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <h3>{editingId ? "Update Event" : "New Event"} {format(date, "MMM do")}</h3>
              <button className="cp-btn-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form>
              <div className="cp-form-group">
                <label className="cp-label">Event Title</label>
                <input
                  autoFocus
                  type="text"
                  name="name"
                  className="cp-input"
                  placeholder="What do you need to do?"
                  value={calForm.name}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="cp-row-2 cp-form-group">
                <div className="cp-col">
                  <label className="cp-label">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    className="cp-input"
                    value={calForm.startTime}
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="cp-col">
                  <label className="cp-label">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    className="cp-input"
                    value={calForm.endTime}
                    onChange={handleChangeInput}
                  />
                </div>
              </div>

              <div className="cp-form-group">
                <label className="cp-label">Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  className="cp-input"
                  placeholder="Add details..."
                  value={calForm.description}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="cp-form-group">
                <label className="cp-label">Color Label</label>
                <div className="cp-colors">
                  {colors.map((c) => (
                    <div
                      key={c}
                      className={`cp-color-circle ${
                        calForm.color === c ? "selected" : ""
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => handleChangeColor(c)}
                    ></div>
                  ))}
                </div>
                <input type="hidden" name="color" value={calForm.color} />
              </div>

              <div className="cp-modal-footer">
                <button
                  type="button"
                  className="cp-btn-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cp-btn-save"
                  onClick={handleSubmit}
                >
                  {editingId ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
