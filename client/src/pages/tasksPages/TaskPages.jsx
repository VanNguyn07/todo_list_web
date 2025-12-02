import React from "react";
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
} from "lucide-react";
import "./TaskPages.css";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useTaskPages } from "../../hooks/useTaskPages";
import { UpdateAndCreateTask } from "../modalPopup/updateAndCreateTaskModal";

//Cấu hình số cột: default là 2 cột (theo ý bạn)
const breakpointColumnsObj = {
  default: 2, // Màn hình to: 2 cột
  1100: 2, // Màn hình lỡ: vẫn 2 cột
  700: 1, // Màn hình điện thoại: về 1 cột cho dễ nhìn
};

export const TaskPages = ({ onTaskUpdate }) => {
  const taskPageData = useTaskPages();
  const {
    isModalOpen,
    tasks,
    refetch,
    handleOpenAddModal,
    handleOpenEditModal,
    toggleExpand,
  } = taskPageData;

  const {handleSubmitForm} = UpdateAndCreateTask( taskPageData,onTaskUpdate);
  const { handleDelete } = useDeleteTask({
    onSuccess: () => {
      // refetch dữ liệu của TaskPages
      refetch();
      // nếu Dashboard truyền callback thì gọi để Dashboard refetch
      if (typeof onTaskUpdate === "function") onTaskUpdate();
    },
  });

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
                <h3>12</h3>
                <span>Task Total</span>
              </div>
            </div>
            <div className="stat-card done">
              <div className="stat-icon">
                <CheckSquare size={30} />
              </div>
              <div className="stat-info">
                <h3>5</h3>
                <span>Completed</span>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <Clock size={30} />
              </div>
              <div className="stat-info">
                <h3>7</h3>
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

        {/* BUTTON THÊM MỚI */}

        <div className="task-btn-group">
          <button className="task-btn total" onClick={handleOpenAddModal}>
            <List size={18} /> Task Total
          </button>

          <button className="task-btn pending" onClick={handleOpenAddModal}>
            <Timer size={18} /> Pending
          </button>

          <button className="task-btn completed" onClick={handleOpenAddModal}>
            <CheckCircle size={18} /> Completed
          </button>

          <button className="task-btn add-new" onClick={handleOpenAddModal}>
            <PlusCircle size={18} /> Add New Task
          </button>
        </div>

        {/* DANH SÁCH TASK (TASK LIST) */}
        {tasks && tasks.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {tasks.map((task) => (
              <div
                key={task.idTask}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                <div className="card-main">
                  {/* Checkbox & Info */}
                  <div className="card-left">
                    <button
                      className={`checkbox-custom ${
                        task.completed ? "checked" : ""
                      }`}
                    >
                      {task.completed && <Check size={14} strokeWidth={4} />}
                    </button>

                    <div className="task-info">
                      <div className="task-title-row">
                        <h3
                          className={task.completed ? "text-strikethrough" : ""}
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
                                (task.detailTask.filter((s) => s.completed)
                                  .length /
                                  task.detailTask.length) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {task.detailTask.filter((s) => s.completed).length}/
                          {task.detailTask.length} SubTask
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

                    {/* --- NÚT MŨI TÊN (SỬA ĐOẠN NÀY) --- */}
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

                    <button className="action-btn takeNow tooltip-container">
                      <Zap size={20} />
                      <span className="tooltip-text-for-task">Do it now</span>
                    </button>
                  </div>
                </div>

                {/* Phần mở rộng (Subtasks & Detail) */}
                <div className={`card-details ${task.expanded ? "show" : ""}`}>
                  <p className="desc">
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
                    {task.detailTask.map((sub) => (
                      <div key={sub.id} className="subtask-row">
                        <div
                          className={`mini-checkbox ${
                            sub.completed ? "checked" : ""
                          }`}
                        >
                          {sub.completed && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span
                          className={sub.completed ? "text-strikethrough" : ""}
                        >
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        )}
      </div>

      {/* --- MODAL (ADD / EDIT TASK) --- */}
      {isModalOpen && (
        handleSubmitForm()
      )}
    </div>
    // </div>
  );
};
