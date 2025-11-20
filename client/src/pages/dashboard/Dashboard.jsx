import React, { useState } from "react";
import Body from "../../components/body/Body";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import TaskCard from "../../components/taskCard/TaskCard";
import Textarea from "../../components/textArea/Textarea";
import Logo from "../../assets/images/logo.png";
import Pomodoro from "../../components/pomodoro/Pomodoro";
import StreakWidget from "../../components/streak/StreakWidget";
import CompeledTask from "../../components/TaskWidget/CompeledTask";
import PendingTask from "../../components/taskWidget/PendingTask";
import QuickNotesWidget from "../../components/quickNotes/QuickNotes";
import { WeeklyProcessChart } from "../../components/recharts/WeeklyProccessChart";
import { CalendarWidget } from "../../components/calendarWidget/CalendarWidget";
import mockTasks from "../../components/utils/MockDataChart";
import DUMMY_GOALS from "../../components/utils/MockDataProcess";
import { ProcessGoal } from "../../components/processGoal/ProcessGoal";
import { useAddTask } from "../../hooks/UseAddTask";
import { useButtonActive } from "../../hooks/UseButtonActive";
import { useFetchTasks } from "../../hooks/useFetchTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { usePomodoro } from "../../hooks/usePomodoro";
import { TaskDatePicker } from "../../components/datePicker/TaskDatePicker";
import Contact from "../contact/contact";
import "./Dashboard.css";
import AboutUs from "../aboutUs/aboutUs";

function Dashboard() {
  const currentStreakCount = 10;
  const currentCompeledTaskCount = 5;
  const currentPendingTaskCount = 10;
  const [goals, _setGoals] = useState(DUMMY_GOALS);

  console.log('Dữ liệu GỐC trong "goals":', goals);

  const sortedGoals = [...goals].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  console.log('Dữ liệu GỐC trong "sortedGoals":', sortedGoals);

  const { activeView, handleViewChange } = useButtonActive("home");
  // 1. Gọi hook fetch, lấy ra hàm 'refetch'
  const { tasks, isLoading, error, refetch } = useFetchTasks();

  const { taskForm, handleInputChange, handleDateChange, handleAddTask } =
    useAddTask({ onSuccess: refetch });

  const { handleDelete, isDeleting } = useDeleteTask({ onSuccess: refetch });

  const {
    isActive,
    mode,
    formatTime,
    skipPlay,
    startPlay,
    pausePlay,
    resetTimer,
    circumference,
    progressOffset,
  } = usePomodoro();
  if (isLoading) {
    return <div>Đang tải danh sách task...</div>;
  }

  // 4. Xử lý trạng thái Lỗi
  if (error) {
    return <div>Lỗi: {error}</div>;
  }
  return (
    <>
      <div id="dashboard-page" className="animate__animated animate__fadeIn">
        <Header>
          <nav className="sidebar-nav">
            <div className="logo-header-page">
              <img src={Logo} alt="Logo" />
              <h1>Todo List</h1>
            </div>

            <Button
              className={`btn-sidebar btn-home ${
                activeView === "home" ? "active" : ""
              }`}
              id="homeButton"
              onClick={() => handleViewChange("home")}
            >
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </Button>

            <Button
              className={`btn-sidebar btn-Tasks ${
                activeView === "task" ? "active" : ""
              }`}
              id="taskButton"
              onClick={() => handleViewChange("task")}
            >
              <i className="fa-solid fa-list-check"></i>
              <span>Tasks</span>
            </Button>

            <Button
              className={`btn-sidebar btn-pomodoro ${
                activeView === "pomodoro" ? "active" : ""
              }`}
              id="pomodoroButton"
              onClick={() => handleViewChange("pomodoro")}
            >
              <i className="fa-solid fa-hourglass-half"></i>
              <span>Pomodoro</span>
            </Button>

            <Button
              className={`btn-sidebar btn-analytics ${
                activeView === "analytics" ? "active" : ""
              }`}
              id="analyticsButton"
              onClick={() => handleViewChange("analytics")}
            >
              <i className="fa-solid fa-chart-pie"></i>
              <span>Analytics</span>
            </Button>

            <Button
              className={`btn-sidebar btn-quick-notes ${
                activeView === "quick-notes" ? "active" : ""
              }`}
              id="quickNotesButton"
              onClick={() => handleViewChange("quick-notes")}
            >
              <i className="fa-solid fa-note-sticky"></i>
              <span>Quick Notes</span>
            </Button>

            <Button
              className={`btn-sidebar btn-habit-tracker ${
                activeView === "habit-tracker" ? "active" : ""
              }`}
              id="habitTrackerButton"
              onClick={() => handleViewChange("habit-tracker")}
            > 
              <i className="fa-solid fa-calendar-check"></i>
              <span>Habit Tracker</span>
            </Button>

            <Button
              className={`btn-sidebar btn-calendar ${
                activeView === "calendar" ? "active" : ""
              }`}
              id="calendarButton"
              onClick={() => handleViewChange("calendar")}
            >
              <i className="fa-solid fa-calendar-days"></i>
              <span>Calendar</span>
            </Button>

            <Button
              className={`btn-sidebar btn-settings ${
                activeView === "settings" ? "active" : ""
              }`}
              id="settingsButton"
              onClick={() => handleViewChange("settings")}
            >
              <i className="fa-solid fa-gear"></i>
              <span>Settings</span>
            </Button>
          </nav>
          <div className="header-page">
            <div className="content-header">
              <div className="container-navbar-header">
                <div className="container-btn-header">
                  <div className="search-and-button-evt">
                    <div className="search-everything">
                      <Input
                        type="text"
                        placeholder="Search everything..."
                        className="input-search-evt"
                      />
                      <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    </div>

                    <div className="container-btn-search">
                      <Button className="btn-search btn-seach-evt">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                      </Button>
                    </div>
                  </div>

                  <Button className="btn-modern btn-dark-light">
                    <label className="switch">
                      <input
                        id="input"
                        type="checkbox"
                        defaultChecked={false}
                      />
                      <div className="slider round">
                        <div className="sun-moon">
                          <svg
                            id="moon-dot-1"
                            className="moon-dot"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="moon-dot-2"
                            className="moon-dot"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="moon-dot-3"
                            className="moon-dot"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="light-ray-1"
                            className="light-ray"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="light-ray-2"
                            className="light-ray"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="light-ray-3"
                            className="light-ray"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>

                          <svg
                            id="cloud-1"
                            className="cloud-dark"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="cloud-2"
                            className="cloud-dark"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="cloud-3"
                            className="cloud-dark"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="cloud-4"
                            className="cloud-light"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="cloud-5"
                            className="cloud-light"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                          <svg
                            id="cloud-6"
                            className="cloud-light"
                            viewBox="0 0 100 100"
                          >
                            <circle cx="50" cy="50" r="50"></circle>
                          </svg>
                        </div>
                        <div className="stars">
                          <svg id="star-1" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                          </svg>
                          <svg id="star-2" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                          </svg>
                          <svg id="star-3" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                          </svg>
                          <svg id="star-4" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                          </svg>
                        </div>
                      </div>
                    </label>
                  </Button>

                  <Button
                    className="btn-modern btn-contract"
                    onClick={() => handleViewChange("contact")}
                  >
                    <i className="fa-solid fa-file-signature"></i>
                    <span>Contact</span>
                  </Button>

                  <Button
                    className="btn-modern btn-aboutme"
                    onClick={() => handleViewChange("aboutus")}
                  >
                    <i className="fa-solid fa-circle-info"></i>
                    <span>About us</span>
                  </Button>

                  <Button className="btn-modern btn-quick-add">
                    <i class="fa-solid fa-plus"></i>
                  </Button>

                  <Button className="btn-modern btn-noti">
                    <i className="fa-solid fa-bell"></i>
                  </Button>

                  <Button className="btn-modern btn-user">
                    <i className="fa-solid fa-user"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Header>

        <Body>
          <div className="parent">
            <div className="text-hello-user">
              <h1>Hello..., Start your planning today</h1>
            </div>

            <div className="container-add-filter-task">
              <div className="form-enter-task">
                <Input
                  type="text"
                  placeholder="Type Title Of Task"
                  className="task-title-input"
                  name="titleTask"
                  id="titleTask"
                  value={taskForm.titleTask}
                  onChange={handleInputChange}
                />

                <Textarea
                  placeholder="Detail Of Your Task"
                  className="task-detail-input"
                  name="detailTask"
                  id="detailTask"
                  value={taskForm.detailTask}
                  onChange={handleInputChange}
                />

                <Button
                  className="add-task-btn"
                  id="addTaskButton"
                  onClick={handleAddTask}
                >
                  <i className="fa-solid fa-plus"></i>
                </Button>
              </div>

              <div className="form-filter-task">
                <select
                  className="filter-task"
                  id="categoryTask"
                  name="categoryTask"
                  value={taskForm.categoryTask} // <-- Kết nối
                  onChange={handleInputChange} // <-- Kết nối
                >
                  <option value="" disabled>
                    By category
                  </option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="study">Study</option>
                </select>

                <TaskDatePicker
                  selectedDate={taskForm.deadlineTask}
                  onDateChange={handleDateChange}
                />

                <div className="search-task-by-name">
                  <Input
                    type="text"
                    placeholder="Search task by name"
                    className="search-input"
                  />
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                </div>
              </div>
            </div>

            <div className="chart-widget-container">
              <WeeklyProcessChart allTasks={mockTasks} />
            </div>

            <div className="container-task">
              <div className="subcontainer-task">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.idTask}
                    className={`content-task-${index + 1}`}
                  >
                    <div className="content-left">
                      <h2>{task.titleTask}</h2>
                      <p>{task.detailTask}</p>
                      <h3>Deadline Task: {task.deadlineTask}</h3>
                    </div>

                    <div className="content-right">
                      <input
                        type="checkbox"
                        name="completed"
                        id={`completed-${task.idTask}`}
                      />

                      <Button className="btn-task btn-pen-to-square">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Button>

                      <Button
                        className="btn-task btn-trash"
                        onClick={() => handleDelete(task.idTask)}
                        disabled={isDeleting}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </div>
                  </TaskCard>
                ))}
                {tasks.length === 0 && (
                  <p>Tuyệt vời! Bạn không có task nào sắp tới hạn.</p>
                )}
              </div>
            </div>

            <div className="calendar-widget-container">
              <CalendarWidget />
            </div>

            <Pomodoro className="pomodoro-focus-widget">
              <div className="title-for-pomodoro-widget">
                <i className="fa-regular fa-clock"></i>
                <p id="title-pomodoro-focus">{mode === "FOCUS" ? "Pomodoro Focus" : "Short Break"}</p>
              </div>
              <div className="text-current-task">
                <p>CURRENT TASK</p>
                <p id="name-of-current-task">
                  Finish UI Design for Analytics Page
                </p>
              </div>

              <div className="pomodoro-widget-container">
                <div className="pomodoro-timer">
                  <svg
                    className="timer-svg"
                    width="150"
                    height="150"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      className="timer-bg"
                      cx="50"
                      cy="50"
                      r="45"
                    ></circle>

                    <circle
                      className="timer-progress"
                      cx="50"
                      cy="50"
                      r="45"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: progressOffset,
                        transition: "stroke-dashoffset 1s linear",
                      }}
                    ></circle>
                  </svg>

                  <div className="timer-text" id="pomodoro-time">
                    {formatTime()}
                  </div>
                </div>
              </div>

              <div className="btn-container">
                {!isActive ? (
                  <Button
                    className="btn-control-pomodoro btn-start"
                    onClick={startPlay}
                  >
                    <i className="fa-solid fa-play start-icon"></i>
                  </Button>
                ) : (
                  <Button
                    className="btn-control-pomodoro btn-pause"
                    onClick={pausePlay}
                  >
                    <i className="fa-solid fa-pause pause-icon"></i>
                  </Button>
                )}

                <Button
                  className="btn-control-pomodoro btn-skip"
                  onClick={skipPlay}
                >
                  <i className="fa-solid fa-forward skip-icon"></i>
                </Button>

                <Button
                  className="btn-control-pomodoro btn-reset"
                  onClick={resetTimer}
                >
                  <i className="fa-solid fa-rotate-left reset-icon"></i>
                </Button>
              </div>
            </Pomodoro>

            <div className="container-task-widget">
              <CompeledTask
                className="task-widget compeleted-task"
                title="Compeled Task"
                compeledTaskCount={currentCompeledTaskCount}
              />

              <PendingTask
                className="task-widget pending-task"
                title="Pending Task"
                pendingTaskCount={currentPendingTaskCount}
              />
            </div>

            <div className="streak-widget-container">
              <StreakWidget
                title="Your Streak"
                streakCount={currentStreakCount}
              />
            </div>
            
              <QuickNotesWidget className="contentNotes" />

            <div className="process-goal-container">
              <h3>Target due date</h3>
              {sortedGoals.map((item) => (
                <ProcessGoal key={item.id} {...item} />
              ))}
            </div>
          </div>
        </Body>

        {/* Contact overlay + backdrop */}
        {activeView === "contact" && (
          <>
            <div
              className="modal-backdrop"
              onClick={() => handleViewChange("home")}
            />
            <div className="contact-overlay" role="dialog" aria-modal="true">
              <Contact />
            </div>
          </>
        )}

        {activeView === "aboutus" && (
          <>
            <div
              className="modal-backdrop"
              onClick={() => handleViewChange("home")}
            />
            <div className="contact-overlay" role="dialog" aria-modal="true">
              <AboutUs />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
