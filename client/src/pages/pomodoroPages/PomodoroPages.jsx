import { useState } from "react";
import man1 from "../../assets/images/man-avatar-1.png";
import man2 from "../../assets/images/man-avatar-2.png";
import man3 from "../../assets/images/man-avatar-3.png";
import woman1 from "../../assets/images/woman-avatar-1.png";
import woman2 from "../../assets/images/woman-avatar-2.png";
import woman3 from "../../assets/images/woman-avatar-3.png";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Pencil,
  Users,
  Music,
  Settings,
  CloudRain,
  Radio,
  ImageIcon,
  Volume2,
  Timer,
} from "lucide-react";
import "./PomodoroPages.css";
import { usePomodoroPages } from "./usePomodoroPages";
import Button from "../../components/button/Button";

const mockUsers = [
  { id: 1, name: "Alice", avatar: woman1, status: "focus" },
  { id: 2, name: "Bob", avatar: man1, status: "break" },
  { id: 3, name: "Carol", avatar: woman2, status: "focus" },
  { id: 4, name: "David", avatar: man2, status: "idle" },
  { id: 5, name: "Eve", avatar: woman3, status: "focus" },
  { id: 6, name: "Frank", avatar: man3, status: "break" },
];

export const PomodoroPages = ({activeTitleTask}) => {
  const [activeTab, setActiveTab] = useState("room");
  const {
    isActive,
    progressOffset,
    timeLeft,
    mode,
    circumference,
    bgInputRef,
    audioInputRef,
    audioRef,
    volumes,
    sessionsCompleted,
    breaksTaken,
    totalMinutes,
    handleChange,
    skipTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    handleAudioUpload,
    handleBgUpload,
    handleVolumeChange,
  } = usePomodoroPages();
  return (
    <div className="pomodoro-app" data-mode={mode}>
      <div className="header-page-pomodoro">
        <div className="header-page-title-pomodoro">
          <p className="header-page-icon-pomodoro">
            <Timer size={50} /> Focus Flow
          </p>
        </div>
        <div className="header-subtitle-pomodoro">
          <p>Master your minutes, master your mind.</p>
        </div>
      </div>
      <main className="dashboard">
        <section className="timer-section">
          <div className="timer-container">
            <svg
              className="timer-ring"
              width="500"
              height="500"
              viewBox="0 0 320 320"
            >
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="var(--ring-bg)"
                strokeWidth="12"
              />
              <circle
                cx="160"
                cy="160"
                r="140"
                className="progress-ring"
                strokeWidth="12"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: progressOffset,
                  transition: "stroke-dashoffset 1s linear",
                }}
              />
            </svg>
            <div className="timer-content">
              <span className="mode-label">
                {mode === "FOCUS" ? "Pomodoro Focus" : "Short Break"}
              </span>
              <span className="timer-display">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="controls">
            <button
              className="control-btn secondary"
              onClick={resetTimer}
              aria-label="Reset timer"
            >
              <RotateCcw size={20} />
            </button>
            {!isActive ? (
              <Button className="control-btn btn-start" onClick={startTimer}>
                <Play size={28} />
                <span className="tooltip-text">Start</span>
              </Button>
            ) : (
              <Button className="control-btn btn-pause" onClick={pauseTimer}>
                <Pause size={28} />
                <span className="tooltip-text">Pause</span>
              </Button>
            )}
            <button
              className="control-btn secondary"
              onClick={skipTimer}
              aria-label="Skip to next mode"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </section>

        <div className="container-right">
          <div className="top-panel">
            <div className="card-pomodoro task-card-pomodoro">
              <div className="task-header">
                <Pencil size={18} className="task-icon" />
                <span>Current Task</span>
              </div>
              <input
                type="text"
                className="task-input"
                placeholder="What are you working on?"
                value={activeTitleTask}
                onChange={handleChange}
              >

              </input>
            </div>
            <div className="card-pomodoro stats-card">
              <h3 className="card-title">Daily Stats</h3>
              <div className="stats-pomodoro">
                <div className="stat-item">
                  <div
                    className={`stat-circle ${
                      sessionsCompleted > 0 ? "active" : ""
                    }`}
                  >
                    <span className="stat-value">{sessionsCompleted}</span>
                  </div>
                  <span className="stat-label">Sessions</span>
                </div>
                <div className="stat-item">
                  <div
                    className={`stat-circle ${
                      totalMinutes > 0 ? "active" : ""
                    }`}
                  >
                    <span className="stat-value">
                      {Math.round(totalMinutes)}
                    </span>
                  </div>
                  <span className="stat-label">Minutes</span>
                </div>
                <div className="stat-item">
                  <div
                    className={`stat-circle ${breaksTaken > 0 ? "active" : ""}`}
                  >
                    <span className="stat-value">{breaksTaken}</span>
                  </div>
                  <span className="stat-label">Breaks</span>
                </div>
              </div>
              <div className="container-btn-reset"></div>
              <Button className="btn-reset-stats">
                <RotateCcw size={20} /> Reset
              </Button>
            </div>
          </div>

          <div className="right-panel">
            <div className="card-pomodoro tabbed-card">
              <div className="tab-nav">
                <div className="tab-pill">
                  <button
                    className={`tab-btn ${
                      activeTab === "room" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("room")}
                  >
                    <Users size={16} />
                    <span>Room</span>
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "vibe" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("vibe")}
                  >
                    <Music size={16} />
                    <span>Vibe</span>
                  </button>
                  {/* <button
                    className={`tab-btn ${
                      activeTab === "settings" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>  */}
                </div>
              </div>
              <div className="tab-content">
                {activeTab === "room" && (
                  <div className="room-tab">
                    <p className="tab-description">People focusing with you</p>
                    <div className="users-grid">
                      {mockUsers.map((user) => (
                        <div key={user.id} className="user-avatar-container">
                          <div className={`user-avatar ${user.status}`}>
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                          </div>
                          <span className="user-name">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "vibe" && (
                  <div className="vibe-tab">
                    <p className="tab-description">Customize your ambience</p>
                    <div className="sound-mixers">
                      <div className="mixer-item">
                        <CloudRain size={18} />
                        <span>Rain</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volumes.rain}
                          onChange={(e) =>
                            handleVolumeChange("rain", Number(e.target.value))
                          }
                          className="volume-slider"
                        />
                        <span className="volume-value">{volumes.rain}%</span>
                      </div>
                      <div className="mixer-item">
                        <Radio size={18} />
                        <span>Lofi</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volumes.lofi}
                          onChange={(e) =>
                            handleVolumeChange("lofi", Number(e.target.value))
                          }
                          className="volume-slider"
                        />
                        <span className="volume-value">{volumes.lofi}%</span>
                      </div>
                    </div>
                    <div className="upload-buttons">
                      <button
                        className="upload-btn"
                        onClick={() => bgInputRef.current?.click()}
                      >
                        <ImageIcon size={16} />
                        <span>Upload Background</span>
                      </button>
                      <button
                        className="upload-btn"
                        onClick={() => audioInputRef.current?.click()}
                      >
                        <Volume2 size={16} />
                        <span>Upload Audio</span>
                      </button>
                      <input
                        ref={bgInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBgUpload}
                        style={{ display: "none" }}
                      />
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                    <audio ref={audioRef} loop />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
