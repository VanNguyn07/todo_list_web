import React, { useState } from "react";
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
} from "lucide-react";
import "./TaskPages.css";

//Cấu hình số cột: default là 2 cột (theo ý bạn)
const breakpointColumnsObj = {
  default: 2, // Màn hình to: 2 cột
  1100: 2, // Màn hình lỡ: vẫn 2 cột
  700: 1, // Màn hình điện thoại: về 1 cột cho dễ nhìn
};
// --- DỮ LIỆU GIẢ (DUMMY DATA) ĐỂ HIỂN THỊ ---
const DUMMY_TASKS = [
  {
    id: 1,
    title: "Thiết kế giao diện Landing Page",
    description: "Sử dụng tông màu Cream và Gold, bố cục hiện đại.",
    category: "Work",
    deadline: "2023-11-25",
    completed: false,
    expanded: true,
    subtasks: [
      { id: 101, title: "Vẽ Wireframe", completed: true },
      { id: 102, title: "Chọn icon set", completed: false },
      { id: 103, title: "Prototype trên Figma", completed: false },
    ],
  },
  {
    id: 2,
    title: "Thiết kế giao diện Landing Page",
    description: "Sử dụng tông màu Cream và Gold, bố cục hiện đại.",
    category: "Study",
    deadline: "2023-11-25",
    completed: false,
    expanded: true,
    subtasks: [
      { id: 101, title: "Vẽ Wireframe", completed: true },
      { id: 102, title: "Chọn icon set", completed: false },
      { id: 103, title: "Prototype trên Figma", completed: false },
    ],
  },
  {
    id: 3,
    title: "Thiết kế giao diện Landing Page",
    description: "Sử dụng tông màu Cream và Gold, bố cục hiện đại.",
    category: "Work",
    deadline: "2023-11-25",
    completed: false,
    expanded: true,
    subtasks: [
      { id: 101, title: "Vẽ Wireframe", completed: true },
      { id: 102, title: "Chọn icon set", completed: false },
      { id: 103, title: "Prototype trên Figma", completed: false },
    ],
  },
  {
    id: 4,
    title: "Đi siêu thị cuối tuần",
    description: "Mua đồ ăn cho cả tuần và đồ dùng nhà bếp.",
    category: "Personal",
    deadline: "2023-11-26",
    completed: true,
    expanded: false,
    subtasks: [
      { id: 201, title: "Mua rau củ", completed: true },
      { id: 202, title: "Mua thịt cá", completed: true },
    ],
  },
];

export const TaskPages = () => {
  // State giả để test giao diện (Gõ phím, đóng mở modal)
  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho Form trong Modal (Để bạn gõ được chữ)
  const [formState, setFormState] = useState({
    title: "",
    category: "Work",
    deadline: "",
    description: "",
    subtasks: [],
  });
  const [subtaskInput, setSubtaskInput] = useState("");

  // --- HÀM GIẢ LẬP UI (CHỈ ĐỂ TEST GIAO DIỆN) ---
  const handleOpenAddModal = () => {
    setFormState({
      title: "",
      category: "Work",
      deadline: "",
      description: "",
      subtasks: [],
    });
    setIsModalOpen(true);
  };

  // const handleOpenEditModal = (task) => {
  //   setFormState(task); // Đổ dữ liệu giả vào form
  //   setIsModalOpen(true);
  // };

  const closeModal = () => setIsModalOpen(false);

  // Hàm giả để gõ được vào input
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Hàm giả để gõ subtask input
  const handleSubtaskNameChange = (id, value) => {
    const updatedSubs = formState.subtasks.map((s) =>
      s.id === id ? { ...s, title: value } : s
    );
    setFormState({ ...formState, subtasks: updatedSubs });
  };

  // Hàm giả thêm subtask (Enter)
  const handleAddSubtask = (e) => {
    if (e.key === "Enter" && subtaskInput.trim()) {
      const newSub = { id: Date.now(), title: subtaskInput, completed: false };
      setFormState({ ...formState, subtasks: [...formState.subtasks, newSub] });
      setSubtaskInput("");
    }
  };

  // Hàm giả xóa subtask
  const handleDeleteSubtask = (id) => {
    setFormState({
      ...formState,
      subtasks: formState.subtasks.filter((s) => s.id !== id),
    });
  };

  // --- Logic Đóng/Mở chi tiết Task ---
  const toggleExpand = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        // Nếu đúng ID thì đảo ngược trạng thái expanded (true -> false, false -> true)
        task.id === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };

  return (
    // <div className="SCOPE_TASK_PAGE">
    <div className="app-wrapper">
      {/* Toast Thông báo (Demo hiển thị)
      <div className="toast-container">
        <div className="toast-item success">
          <CheckCircle size={18} /> <span>Chào mừng trở lại!</span>
        </div>
      </div> */}

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
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {tasks.map((task) => (
            <div
              key={task.id}
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
                        {task.title}
                      </h3>
                      <span
                        className={`category-badge ${task.category.toLowerCase()}`}
                      >
                        {task.category}
                      </span>
                    </div>

                    {/* Progress Bar Subtask */}
                    <div className="progress-wrapper">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${
                              (task.subtasks.filter((s) => s.completed).length /
                                task.subtasks.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {task.subtasks.filter((s) => s.completed).length}/
                        {task.subtasks.length} subtasks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Buttons */}
                <div className="card-actions">
                  {/* Các nút Edit, Delete giữ nguyên */}
                  <button
                    // onClick={() => openEditModal(task)}
                    className="action-btn edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    // onClick={() => deleteTask(task.id)}
                    className="action-btn delete"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* --- NÚT MŨI TÊN (SỬA ĐOẠN NÀY) --- */}
                  <button
                    className="action-btn expand tooltip-container"
                    onClick={() => toggleExpand(task.id)}
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
                </div>
              </div>

              {/* Phần mở rộng (Subtasks & Detail) */}
              <div className={`card-details ${task.expanded ? "show" : ""}`}>
                <p className="desc">{task.description || "Không có mô tả."}</p>
                <div className="meta-info">
                  <span>
                    <Calendar size={14} /> Deadline:{" "}
                    {task.deadline || "No deadline"}
                  </span>
                </div>

                <div className="subtask-display-list">
                  {task.subtasks.map((sub) => (
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
              <h2>{formState.id ? "✏️ Cập Nhật Task" : "✨ Thêm Task Mới"}</h2>
              <button onClick={closeModal} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Title Input */}
              <div className="input-group">
                <label>Tiêu đề công việc</label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tên task..."
                />
              </div>

              {/* Category & Date */}
              <div className="row-group">
                <div className="input-group">
                  <label>Danh mục</label>
                  <select
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Hạn chót</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formState.deadline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="input-group">
                <label>Mô tả chi tiết</label>
                <textarea
                  name="description"
                  rows="2"
                  value={formState.description}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm..."
                />
              </div>

              {/* --- SUBTASK MANAGER (PHẦN QUAN TRỌNG) --- */}
              <div className="subtask-manager-section">
                <label>Danh sách việc nhỏ (Subtasks)</label>

                {/* Input thêm mới */}
                <div className="add-subtask-row">
                  <Plus size={18} className="add-icon-input" />
                  <input
                    type="text"
                    placeholder="Nhập tên việc nhỏ rồi nhấn Enter..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={handleAddSubtask}
                  />
                </div>

                {/* List Subtask có thể sửa/xóa */}
                <div className="modal-subtask-list">
                  {formState.subtasks.map((sub) => (
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
                  {formState.subtasks.length === 0 && (
                    <p className="empty-subtask-text">Chưa có subtask nào.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Hủy bỏ
              </button>
              <button className="btn-save" onClick={closeModal}>
                <Save size={18} /> Lưu Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};
