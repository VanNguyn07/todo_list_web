import React, { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import {
  List,
  Timer,
  CheckCircle,
  PlusCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Bell,
  Calendar,
  Tag,
  Edit2,
  X,
  Save,
  Check,
  AlertCircle,
  BarChart3,
  CheckSquare,
  Clock,
  Zap,
  Sun,
} from "lucide-react";
import "./TaskPages.css";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useTaskPages } from "../../hooks/useTaskPages";
import { UpdateAndCreateTask } from "../modalPopup/updateAndCreateTaskModal";
import { updateTaskStatus } from "../../hooks/useUpdateStatus";

//Cấu hình số cột: default là 2 cột 
const breakpointColumnsObj = {
  default: 2, // Màn hình to: 2 cột
  1100: 2, // Màn hình lỡ: vẫn 2 cột
  700: 1, // Màn hình điện thoại: về 1 cột cho dễ nhìn
};

export const TaskPages = ({ onTaskUpdate, activeTaskId, handleTransitionPage }) => {
  const taskPageData = useTaskPages();

  const {
    isModalOpen,
    tasks,
    refetch,
    handleOpenAddModal,
    handleOpenEditModal,
    toggleExpand,
    isActive,
    handleTransition,
    filteredTask,
    handleToggleStatusSubtask
  } = taskPageData;

  const { handleDelete } = useDeleteTask({
    onSuccess: () => {
      // refetch dữ liệu của TaskPages
      refetch();
      // nếu Dashboard truyền callback thì gọi để Dashboard refetch
      if (typeof onTaskUpdate === "function") onTaskUpdate();
    },
  });

  const taskRefs = useRef({});

  const { handleSubmitCompleted } = updateTaskStatus({
    onsuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    //Kiểm tra nếu có activeTaskId và thẻ đó đã tồn tại trên giao diện
    if (activeTaskId && tasks && tasks.length > 0) {
      const targetElement = taskRefs.current[activeTaskId];
      if (targetElement) {
        console.log("Đang cuộn đến task:", activeTaskId); // Kiểm tra xem nó có nhảy vào đây không
        targetElement.scrollIntoView({
          behavior: "smooth", // Cuộn mượt mà
          block: "center", // Đưa thẻ vào giữa màn hình
          inline: "nearest",
        });
      }
    }
  }, [activeTaskId, tasks]);

  const totalTask = tasks?.length || 0; //Lấy số lượng task, nếu chưa có dữ liệu thì mặc định là 0
  const completedTask =
    tasks?.filter(
      (task) => task.completed === "true" || task.completed === true
    ).length || 0;
  const pendingTask = totalTask - completedTask;

  return (
    // <div className="SCOPE_TASK_PAGE">
    <div className="app-wrapper">
      <div className="main-container">
        {/* HEADER & STATS */}
        <header className="app-header">
          <div className="header-top">
            <div className="header-text">
              <div className="header-title">
                <i className="fa-solid fa-list-check"></i>
                <h1>My Task Garden</h1>
              </div>
              <p>Manage work easily and efficiently.</p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <BarChart3 size={30} />
              </div>
              <div className="stat-info">
                <h3>{totalTask}</h3>
                <span>Task Total</span>
              </div>
            </div>
            <div className="stat-card done">
              <div className="stat-icon">
                <CheckSquare size={30} />
              </div>
              <div className="stat-info">
                <h3>{completedTask}</h3>
                <span>Completed</span>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <Clock size={30} />
              </div>
              <div className="stat-info">
                <h3>{pendingTask}</h3>
                <span>Pending</span>
              </div>
            </div>
            {/* Plant Widget (Gamification) */}
            <div className="plant-widget">
              <div className="plant-text-gardent">Your Gardent</div>
              <div className="plant-container-icon">
                <span className="plant-icon">🌿</span>
                <div className="plant-info">
                  <span className="plant-label">The tree is growing</span>
                  <div className="plant-progress-bar">
                    <div className="plant-fill" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BUTTON*/}

        <div className="task-btn-group">
          <button
            className={`task-btn total ${
              isActive === "task-total" ? "active" : ""
            }`}
            onClick={() => handleTransition("task-total")}
          >
            <List size={18} /> Task Total
          </button>

          <button
            className={`task-btn pending ${
              isActive === "task-pending" ? "active" : ""
            }`}
            onClick={() => handleTransition("task-pending")}
          >
            <Timer size={18} /> Pending
          </button>

          <button
            className={`task-btn completed ${
              isActive === "task-completed" ? "active" : ""
            }`}
            onClick={() => handleTransition("task-completed")}
          >
            <CheckCircle size={18} /> Completed
          </button>

          <button className="task-btn add-new" onClick={handleOpenAddModal}>
            <PlusCircle size={18} /> Add New Task
          </button>
        </div>

        {/* DANH SÁCH TASK (TASK LIST) */}
        {filteredTask && filteredTask.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredTask.map((task) => (
              <div
                key={task.idTask}
                ref={(el) => (taskRefs.current[task.idTask] = el)}

                className={`task-card ${
                  task.completed === "true" || task.completed === true
                    ? "completed"
                    : ""
                } ${task.idTask === activeTaskId ? "active-highlight" : ""}`}
              >
                <div className="card-main">
                  {/* Checkbox & Info */}
                  <div className="card-left">
                    <button
                      className={`checkbox-custom ${
                        task.completed === "true" || task.completed === true
                          ? "checked"
                          : ""
                      }`}
                      onClick={() =>
                        handleSubmitCompleted(
                          task.idTask,
                          task.completed,
                          "parent"
                        )
                      }
                    >
                      {task.completed && <Check size={14} strokeWidth={4} />}
                    </button>

                    <div className="task-info">
                      <div className="task-title-row">
                        <h3
                          className={
                            task.completed === "true" || task.completed === true
                              ? "text-strikethrough"
                              : ""
                          }
                        >
                          {task.titleTask}
                        </h3>
                        <span
                          className={`category-badge ${task.categoryTask.toLowerCase()}`}
                        >
                          {task.categoryTask}
                        </span>
                      </div>

                      {/* Progress Bar Subtask */}
                      <div className="progress-wrapper">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${
                                task.sub_tasks?.length > 0
                                  ? (task.sub_tasks.filter(
                                      (sub) => String(sub.completed) === "true"
                                    ).length /
                                      task.sub_tasks.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {task.sub_tasks?.filter(
                            (s) => String(s.completed) === "true"
                          ).length || 0}
                          /{task.sub_tasks?.length || 0} SubTask
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="card-actions">
                    {/* Các nút Edit, Delete giữ nguyên */}
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="action-btn edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.idTask)}
                      className="action-btn delete"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      className="action-btn expand tooltip-container"
                      onClick={() => toggleExpand(task.idTask)}
                    >
                      {/* Logic: Nếu đang mở (expanded=true) thì hiện mũi tên LÊN, ngược lại hiện mũi tên XUỐNG */}
                      {task.expanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                      <span className="tooltip-text-for-task">
                        {task.expanded ? "Thu gọn" : "Xem chi tiết"}
                      </span>
                    </button>

                    <button className="action-btn takeNow tooltip-container"
                    onClick={() => handleTransitionPage("pomodoro", task.idTask, task.titleTask)}>
                      <Zap size={20} />
                      <span className="tooltip-text-for-task">Do it now</span>
                    </button>
                  </div>  
                </div>

                {/* Phần mở rộng (Subtasks & Detail) */}
                <div className={`card-details ${task.expanded ? "show" : ""} `}>
                  <p className="description">
                    {task.description || "Don't have descriptions"}
                  </p>
                  <div className="meta-info">
                    <span>
                      <Calendar size={14} /> Deadline:{" "}
                      {task.deadlineTask || "Don't have deadline"}
                    </span>
                  </div>

                  {/* subtask */}
                  <div className="subtask-display-list">
                    {!task.sub_tasks || task.sub_tasks.length === 0 ? (
                      <div className="text-no-sub-task">
                        This task has no sub-tasks
                      </div>
                    ) : (
                      task.sub_tasks.map((sub) => {
                        const isCompleted =
                          sub.completed === "true" || sub.completed === true;
                        return (
                          <div
                            key={sub.idSubTask || sub.tempId}
                            className="subtask-row"
                          >
                            <button
                              className={`mini-checkbox ${
                                isCompleted ? "checked" : ""
                              }`}
                              onClick={() => {
                                sub.idSubTask
                                  ? handleSubmitCompleted(
                                      sub.idSubTask,
                                      sub.completed,
                                      "sub"
                                    )
                                  : handleToggleStatusSubtask(null, sub.tempId);
                              }}
                            >
                              {isCompleted && (
                                <Check size={12} strokeWidth={4} />
                              )}
                            </button>
                            <span
                              className={
                                isCompleted ? "text-strikethrough" : ""
                              }
                            >
                              {sub.content
                                ? sub.content
                                : "Don't have sub-task"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          /* HIỂN THỊ KHI TRỐNG */
          <div className="empty-state-container">
            <AlertCircle size={48} color="#f3d077" />
            <h3>Oops! Don't have any tasks in this category.</h3>
            <p>Try switching filters or add a new task to get started!</p>
          </div>
        )}
      </div>

      {/* --- MODAL (ADD / EDIT TASK) --- */}
      {isModalOpen && (
        <UpdateAndCreateTask 
           taskPageData={taskPageData} 
           onTaskUpdate={onTaskUpdate} 
        />
      )}
    </div>
    // </div>
  );
};
