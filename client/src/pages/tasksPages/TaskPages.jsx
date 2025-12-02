import React, { useState } from "react";
import Masonry from "react-masonry-css";
import DatePicker from "react-datepicker";
// Import CSS bắt buộc của react-datepicker
import "react-datepicker/dist/react-datepicker.css";
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
import { useFetchTasks } from "../../hooks/useFetchTask";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";

//Cấu hình số cột: default là 2 cột (theo ý bạn)
const breakpointColumnsObj = {
  default: 2, // Màn hình to: 2 cột
  1100: 2, // Màn hình lỡ: vẫn 2 cột
  700: 1, // Màn hình điện thoại: về 1 cột cho dễ nhìn
};

export const TaskPages = ({ onTaskUpdate }) => {
  const { tasks, setTasks, refetch } = useFetchTasks("get_all_task_list");

  const { handleSubmitUpdate } = useUpdateTask();
  const { handleDelete } = useDeleteTask({
    onSuccess: () => {
      // refetch dữ liệu của TaskPages
      refetch();
      // nếu Dashboard truyền callback thì gọi để Dashboard refetch
      if (typeof onTaskUpdate === "function") onTaskUpdate();
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    idTask: "",
    titleTask: "",
    detailTask: [],
    categoryTask: "",
    deadlineTask: new Date(),
    description: "",
  });

  const [subtaskInput, setSubtaskInput] = useState("");

  const handleOpenAddModal = () => {
    setFormState({
      idTask: "",
      titleTask: "",
      detailTask: [],
      categoryTask: "",
      deadlineTask: null,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setFormState({
      // sao chép các field, nhưng ép deadlineTask thành Date hoặc null
      idTask: task.idTask,
      titleTask: task.titleTask || "",
      detailTask: Array.isArray(task.detailTask)
        ? task.detailTask
        : task.detailTask
        ? JSON.parse(task.detailTask)
        : [],
      categoryTask: task.categoryTask || "",
      deadlineTask: task.deadlineTask ? new Date(task.deadlineTask) : null,
      description: task.description || "",
      // ... bất kỳ field nào khác
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormState({ ...formState, deadlineTask: date });
  };

  const handleSubtaskNameChange = (id, value) => {
    const updatedSubs = formState.detailTask.map((subtask) =>
      subtask.id === id ? { ...subtask, title: value } : subtask
    );
    setFormState({ ...formState, detailTask: updatedSubs });
  };

  // Hàm giả thêm subtask (Enter)
  const handleAddSubtask = (e) => {
    if (e.key === "Enter" && subtaskInput.trim()) {
      const newSub = { id: Date.now(), title: subtaskInput, completed: false };
      setFormState({
        ...formState,
        detailTask: [...formState.detailTask, newSub],
      });
      setSubtaskInput("");
    }
  };

  // Hàm giả xóa subtask
  const handleDeleteSubtask = (id) => {
    setFormState({
      ...formState,
      detailTask: formState.detailTask.filter((s) => s.id !== id),
    });
  };

  // --- Logic Đóng/Mở chi tiết Task ---
  const toggleExpand = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        // Nếu đúng ID thì đảo ngược trạng thái expanded (true -> false, false -> true)
        task.idTask === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };

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
          <button className="task-btn all" onClick={handleOpenAddModal}>
            <List size={18} /> All
          </button>

          <button className="task-btn taking" onClick={handleOpenAddModal}>
            <Timer size={18} /> Taking
          </button>

          <button className="task-btn done" onClick={handleOpenAddModal}>
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
        <div className="modal-backdrop-task" onClick={closeModal}>
          <div
            className="modal-container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h2>
                {formState.idTask
                  ? "✏️ Update Your Task"
                  : "✨ Create New Task"}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Title Input */}
              <div className="input-group">
                <label>Wotk title</label>
                <input
                  type="text"
                  name="titleTask"
                  value={formState.titleTask}
                  onChange={handleInputChange}
                  placeholder="Nhập tên task..."
                />
              </div>

              {/* Category & Date */}
              <div className="row-group">
                <div className="input-group">
                  <label>Category</label>
                  <select
                    name="categoryTask"
                    value={formState.categoryTask}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>
                      Category
                    </option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Deadline:</label>
                  <DatePicker
                    selected={formState.deadlineTask}
                    onChange={handleDateChange}
                    placeholderText="Click to select date"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    minDate={new Date()} // Không cho chọn ngày trong quá khứ
                    isClearable // Hiển thị nút (x) để xóa ngày đã chọn
                    // Chỉ hiển thị lịch khi bấm vào icon
                    showIcon
                    icon="fa fa-calendar"
                    // Hiển thị tháng và năm để chọn nhanh
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  ></DatePicker>
                </div>
              </div>

              {/* Description */}
              <div className="input-group">
                <label>Descriptions</label>
                <textarea
                  name="description"
                  rows="2"
                  value={formState.description || ""}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm..."
                />
              </div>

              {/* --- SUBTASK MANAGER (PHẦN QUAN TRỌNG) --- */}
              <div className="subtask-manager-section">
                <label>Work list (Subtasks)</label>

                {/* Input thêm mới */}
                <div className="add-subtask-row">
                  <Plus size={18} className="add-icon-input" />
                  <input
                    type="text"
                    placeholder="Type a sub-task and press Enter..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={handleAddSubtask}
                  />
                </div>

                {/* List Subtask có thể sửa/xóa */}
                <div className="modal-subtask-list">
                  {formState.detailTask.map((sub) => (
                    <div key={sub.id} className="modal-subtask-item">
                      {/* Checkbox giả */}
                      <div
                        className={`mini-checkbox ${
                          sub.completed ? "checked" : ""
                        }`}
                      >
                        {sub.completed && <Check size={12} strokeWidth={4} />}
                      </div>

                      {/* Input sửa tên trực tiếp */}
                      <input
                        type="text"
                        className="edit-sub-input"
                        value={sub.title}
                        onChange={(e) =>
                          handleSubtaskNameChange(sub.id, e.target.value)
                        }
                      />

                      {/* Nút xóa subtask */}
                      <button
                        className="btn-mini delete"
                        onClick={() => handleDeleteSubtask(sub.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {formState.detailTask.length === 0 && (
                    <p className="empty-subtask-text">
                      Don't have sub-task created
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={() =>
                  handleSubmitUpdate(
                    {
                      idTask: formState.idTask,
                      taskForm: formState,
                    },
                    () => {
                      closeModal();
                      refetch();
                      if (onTaskUpdate) onTaskUpdate(); // <-- Gọi callback refetch Dashboard
                    }
                  )
                }
              >
                {formState.idTask ? (
                  <>
                    <Save size={18} /> Save
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Create
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};
