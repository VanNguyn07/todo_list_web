import React, { useState } from "react";
import Body from "../../components/body/Body";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import TaskCard from "../../components/taskCard/TaskCard";
import { RenderSubTasks } from "../../components/taskCard/renderSubTasks";
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
import { useAddTask } from "../../hooks/useAddTask";
import { useButtonActive } from "../../hooks/UseButtonActive";
import { useFetchTasks } from "../../hooks/useFetchTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { usePomodoro } from "../../hooks/usePomodoro";
import { useFetchTaskOnUpdateForm } from "../../hooks/useFetchTaskOnUpdateForm";
import { TaskDatePicker } from "../../components/datePicker/TaskDatePicker";
import { UpdateTask } from "../../components/taskCard/updateTask";
import Contact from "../contact/contact";
import { TaskPages } from "../tasksPages/TaskPages";
import { PomodoroPages } from "../pomodoroPages/PomodoroPages";
import { AnalyticsPages } from "../analyticsPages/AnalyticsPages";
import { QuickNotesPages } from "../quickNotesPages/QuickNotesPages";
import { HabitTrackerPages } from "../habitTracker/HabitTrackerPages";
import { CalendarPages } from "../calendarPages/CalendarPages";
import "./Dashboard.css";
import AboutUs from "../aboutUs/aboutUs";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileModal } from "../profile/ProfileModal";

function Dashboard() {
  const currentStreakCount = 10;
  const currentCompeledTaskCount = 5;
  const currentPendingTaskCount = 10;

  const [goals, _setGoals] = useState(DUMMY_GOALS);

  console.log('Dữ liệu GỐC trong "goals":', goals);

  const sortedGoals = [...goals].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  const { activeView, handleTransitionPage } = useButtonActive("home");
  const [activeModal, setActiveMoal] = useState(null);
  // 1. Gọi hook fetch, lấy ra hàm 'refetch'
  const { tasks, refetch } = useFetchTasks("get_nearest_tasks");

  const {
    taskForm,
    subTask,
    currentDetailInput,
    handleDetailChange,
    handleWhenClickEnter,
    removeSubTask,
    handleInputChange,
    handleDateChange,
    handleAddTask,
  } = useAddTask({ onSuccess: refetch });

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

  const {
    handleUpdate,
    isShowFormUpdate,
    taskToUpdate,
    handleCloseFormUpdate,
  } = useFetchTaskOnUpdateForm();

  const username = localStorage.getItem("my_username") || "User";
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("my_username");
    ///Cách nhanh nhất để reset toàn bộ app:
    window.location.href = "/signin";
  };

  return (
    <>
      <div id="dashboard-page">
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
              onClick={() => handleTransitionPage("home")}
            >
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </Button>

            <Button
              className={`btn-sidebar btn-Tasks ${
                activeView === "task" ? "active" : ""
              }`}
              id="taskButton"
              onClick={() => handleTransitionPage("task")}
            >
              <i className="fa-solid fa-list-check"></i>
              <span>Tasks</span>
            </Button>

            <Button
              className={`btn-sidebar btn-pomodoro ${
                activeView === "pomodoro" ? "active" : ""
              }`}
              id="pomodoroButton"
              onClick={() => handleTransitionPage("pomodoro")}
            >
              <i className="fa-solid fa-hourglass-half"></i>
              <span>Pomodoro</span>
            </Button>

            <Button
              className={`btn-sidebar btn-analytics ${
                activeView === "analytics" ? "active" : ""
              }`}
              id="analyticsButton"
              onClick={() => handleTransitionPage("analytics")}
            >
              <i className="fa-solid fa-chart-pie"></i>
              <span>Analytics</span>
            </Button>

            <Button
              className={`btn-sidebar btn-quick-notes ${
                activeView === "quick-notes" ? "active" : ""
              }`}
              id="quickNotesButton"
              onClick={() => handleTransitionPage("quick-notes")}
            >
              <i className="fa-solid fa-note-sticky"></i>
              <span>Quick Notes</span>
            </Button>

            <Button
              className={`btn-sidebar btn-habit-tracker ${
                activeView === "habit-tracker" ? "active" : ""
              }`}
              id="habitTrackerButton"
              onClick={() => handleTransitionPage("habit-tracker")}
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>Habit Tracker</span>
            </Button>

            <Button
              className={`btn-sidebar btn-calendar ${
                activeView === "calendar" ? "active" : ""
              }`}
              id="calendarButton"
              onClick={() => handleTransitionPage("calendar")}
            >
              <i className="fa-solid fa-calendar-days"></i>
              <span>Calendar</span>
            </Button>

            <Link className="btn-logout" onClick={handleLogOut}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Log out</span>
            </Link>
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
                    onClick={() => setActiveMoal("contact")}
                  >
                    <i className="fa-solid fa-file-signature"></i>
                    <span>Contact</span>
                  </Button>

                  <Button
                    className="btn-modern btn-aboutme"
                    onClick={() => setActiveMoal("aboutus")}
                  >
                    <i className="fa-solid fa-circle-info"></i>
                    <span>About us</span>
                  </Button>

                  <Button className="btn-modern btn-quick-add">
                    <i class="fa-solid fa-plus"></i>
                    <span className="tooltip-text">Add Task</span>
                  </Button>

                  <Button className="btn-modern btn-noti">
                    <i className="fa-solid fa-bell"></i>
                    <span className="tooltip-text">Notification</span>
                  </Button>

                  <Button className="btn-modern btn-user" onClick={() => setIsProfileOpen(true)}>
                    <i className="fa-solid fa-user"></i>
                    <span className="tooltip-text">Profile</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Header>

        <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        username={username}
        onLogout={handleLogOut}
        />

        <Body>
          {/* ======================================================== */}
          {/* KHU VỰC 1: TRANG HOME      */}
          {/* ======================================================== */}
          {activeView === "home" && (
            <div className="parent">
              <div className="text-hello-user">
                <h1>Hello {username}, Start your planning today</h1>
              </div>

              <div className="container-add-filter-task">
                <div className="form-enter-task">
                  <div className="input-row">
                    <Input
                      type="text"
                      placeholder="Main Task Name"
                      className="task-title-input"
                      name="titleTask"
                      id="titleTask"
                      spellCheck="flase"
                      value={taskForm.titleTask}
                      onChange={handleInputChange}
                    />

                    <div className="detail-container">
                      <div className="input-with-list">
                        <div className="sub-task-list">
                          {subTask.map((sub) => (
                            <span key={sub.id} className="sub-task-item">
                              • {sub.title}
                              <Button
                                onClick={() => removeSubTask(sub.id)}
                                className="remove-temp-btn"
                              >
                                <X size={13} />
                              </Button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          name="detailTask"
                          className="detail-input-real"
                          id=""
                          spellCheck="false"
                          placeholder={
                            subTask.length > 0
                              ? "Add another sub-task..."
                              : "Type a sub-task and press Enter..."
                          }
                          value={currentDetailInput}
                          onChange={handleDetailChange}
                          onKeyDown={handleWhenClickEnter}
                        />
                      </div>
                    </div>
                    <Button
                      className="add-task-btn"
                      id="addTaskButton"
                      onClick={handleAddTask}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </Button>
                  </div>
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
                        <p>{RenderSubTasks(task.detailTask)}</p>
                        <h3>Deadline Task: {task.deadlineTask}</h3>
                      </div>

                      <div className="content-right">
                        <Button
                          className="btn-task btn-arrow-right"
                          // onClick={() => handleUpdate(task.idTask)}
                        >
                          <i class="fas fa-arrow-right"></i>
                          <span className="tooltip-text">Detail</span>
                        </Button>

                        <Button
                          className="btn-task btn-pen-to-square"
                          onClick={() => handleUpdate(task.idTask)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="tooltip-text">Update</span>
                        </Button>

                        <Button
                          className="btn-task btn-trash"
                          onClick={() => handleDelete(task.idTask)}
                          disabled={isDeleting}
                        >
                          <i className="fa-solid fa-trash"></i>
                          <span className="tooltip-text">Delete</span>
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
                  <p id="title-pomodoro-focus">
                    {mode === "FOCUS" ? "Pomodoro Focus" : "Short Break"}
                  </p>
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
                  <Button
                    className="btn-control-pomodoro btn-skip"
                    onClick={skipPlay}
                  >
                    <i className="fa-solid fa-forward skip-icon"></i>
                    <span className="tooltip-text">Skip</span>
                  </Button>

                  {!isActive ? (
                    <Button
                      className="btn-control-pomodoro btn-start"
                      onClick={startPlay}
                    >
                      <i className="fa-solid fa-play start-icon"></i>
                      <span className="tooltip-text">Start</span>
                    </Button>
                  ) : (
                    <Button
                      className="btn-control-pomodoro btn-pause"
                      onClick={pausePlay}
                    >
                      <i className="fa-solid fa-pause pause-icon"></i>
                      <span className="tooltip-text">Pause</span>
                    </Button>
                  )}

                  <Button
                    className="btn-control-pomodoro btn-reset"
                    onClick={resetTimer}
                  >
                    <i className="fa-solid fa-rotate-left reset-icon"></i>
                    <span className="tooltip-text">Reset</span>
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
          )}

          {/* ======================================================== */}
          {/* KHU VỰC 2: TRANG TASK                                    */}
          {/* ======================================================== */}

          {activeView === "task" && (
            <div className="task-page-wrapper ">
              <TaskPages onTaskUpdate={refetch}/>
            </div>
          )}

          {/* ======================================================== */}
          {/* KHU VỰC 3: TRANG POMODORO                                    */}
          {/* ======================================================== */}
          {activeView === "pomodoro" && (
            <div className="pomodoro-page-wrapper">
              <PomodoroPages />
            </div>
          )}

          {/* ======================================================== */}
          {/* KHU VỰC 4: TRANG ANALYTICS                                    */}
          {/* ======================================================== */}
          {activeView === "analytics" && (
            <div className="analytics-page-wrapper">
              <AnalyticsPages />
            </div>
          )}

          {/* ======================================================== */}
          {/* KHU VỰC 5: TRANG QUICK NOTES                                    */}
          {/* ======================================================== */}
          {activeView === "quick-notes" && (
            <div className="quick-notes-page-wrapper">
              <QuickNotesPages />
            </div>
          )}

          {/* ======================================================== */}
          {/* KHU VỰC 6: TRANG  HABIT TRACKER                                  */}
          {/* ======================================================== */}
          {activeView === "habit-tracker" && (
            <div className="habit-tracker-page-wrapper">
              <HabitTrackerPages />
            </div>
          )}

          {/* ======================================================== */}
          {/* KHU VỰC 7: TRANG  CALENDAR                                  */}
          {/* ======================================================== */}
          {activeView === "calendar" && (
            <div className="caledar-page-wrapper">
              <CalendarPages />
            </div>
          )}
        </Body>

        {/* Contact overlay + backdrop */}
        {activeModal === "contact" && (
          <>
            <div
              className="modal-backdrop"
              onClick={() => setActiveMoal(null)}
            />
            <div className="contact-overlay" role="dialog" aria-modal="true">
              <Contact />
            </div>
          </>
        )}

        {activeModal === "aboutus" && (
          <>
            <div
              className="modal-backdrop"
              onClick={() => setActiveMoal(null)}
            />
            <div className="contact-overlay" role="dialog" aria-modal="true">
              <AboutUs />
            </div>
          </>
        )}
        {isShowFormUpdate && (
          <UpdateTask
            taskData={taskToUpdate}
            onClose={handleCloseFormUpdate}
            onReload={refetch}
          />
        )}
      </div>
    </>
  );
}

export default Dashboard;