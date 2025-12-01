import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Button from "../button/Button";
import "./UpdateTask.css";
import { Plus, Trash2, X, Check, Save } from "lucide-react";
// Import CSS bắt buộc của react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateTask } from "../../hooks/useUpdateTask";

export const UpdateTask = ({ taskData, onClose, onReload }) => {
  //Tạo state nội bộ để quản lý các ô input
  const [formData, setFormData] = useState({
    titleTask: "",
    detailTask: [],
    categoryTask: "",
    deadlineTask: new Date(),
    description: "",
  });

  useEffect(() => {
    // BƯỚC 1: Xử lý detailTask (Từ chuỗi JSON -> Mảng)
    if (taskData) {
      console.log("Form nhận được data:", taskData);
      let parsedSubtasks = [];
      try {
        if (typeof taskData.detailTask === "string") {
          parsedSubtasks = JSON.parse(taskData.detailTask);
        } else if (Array.isArray(taskData.detailTask)) {
          parsedSubtasks = taskData.detailTask;
        }
      } catch (e) {
        console.error("Lỗi parse JSON subtask:", e);
      }
      //  Đổ dữ liệu vào State (Ánh xạ đúng tên cột)
      setFormData({
        titleTask: taskData.titleTask || "",
        detailTask: parsedSubtasks,
        categoryTask: taskData.categoryTask,
        deadlineTask: taskData.deadlineTask
          ? new Date(taskData.deadlineTask)
          : new Date(),
          description: taskData.description || "",
      });
    }
  }, [taskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, deadlineTask: date });
  };

  const handleSubTasksChange = (id, newValue) => {
    // Duyệt qua mảng, tìm đúng cái subtask có id trùng khớp để sửa title
    const updatedSubTasks = formData.detailTask.map((sub) => 
      sub.id === id ? { ...sub, title: newValue } : sub
    );

    setFormData({
      ...formData,
      detailTask: updatedSubTasks,
    })
  };

  const { handleSubmitUpdate } = useUpdateTask();

  const handleDeleteSubtask = (id) => {
    setFormData({
      ...formData,
      detailTask: formData.detailTask.filter((sub) => sub.id !== id),
    });
  };

  const [subtaskInput, setSubtaskInput] = useState("");

  // Hàm giả thêm subtask (Enter)
  const handleAddSubtask = (e) => {
    if (e.key === "Enter" && subtaskInput.trim()) {
      const newSub = { id: Date.now(), title: subtaskInput, completed: false };
      setFormData({
        ...formData,
        detailTask: [...formData.detailTask, newSub],
      });
      setSubtaskInput("");
    }
  };

  //onClick={(e) => e.stopPropagation()} vào cái Form (lớp bên trong).
  // Tại sao? Để khi bạn click vào ô input để gõ chữ, sự kiện click đó không "nổi bong bóng" (bubble) ra ngoài Overlay, tránh việc đang gõ thì form bị đóng.
  return (
    <div className="modal-backdrop-task" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <h2>
            <h1 id="update-title-text">✏️ Update your task</h1>
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Title Input */}
          <div className="input-group">
            <label>Work title</label>
            <input
              type="text"
              name="titleTask"
              value={formData.titleTask}
              onChange={handleChange}
              placeholder="Nhập tên task..."
            />
          </div>

          {/* Category & Date */}
          <div className="row-group">
            <div className="input-group">
              <label>Category</label>
              <select
                name="categoryTask"
                value={formData.categoryTask}
                onChange={handleChange}
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
                selected={formData.deadlineTask}
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
              value={formData.description}
              onChange={handleChange}
              placeholder="More notes..."
            />
          </div>

          {/* --- SUBTASK MANAGER (PHẦN QUAN TRỌNG) --- */}
          <div className="subtask-manager-section">
            <label>Work list(Subtasks)</label>

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
              {formData.detailTask.map((sub) => (
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
                      handleSubTasksChange(sub.id, e.target.value)
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
              {formData.detailTask.length === 0 && (
                <p className="empty-subtask-text">Don't have sub-task created!</p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <Button className="btn-save"
            onClick={() =>
              handleSubmitUpdate(
                { idTask: taskData.idTask, taskForm: formData },
                () => {
                  onClose();
                  if (onReload) onReload();
                }
              )
            }
          >
            <Save size={18} /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};
