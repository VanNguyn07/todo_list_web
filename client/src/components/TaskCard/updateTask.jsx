import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Button from "../button/Button";
import "./UpdateTask.css";
// Import CSS bắt buộc của react-datepicker
import "react-datepicker/dist/react-datepicker.css";
export const UpdateTask = ({ taskData, onClose }) => {
  //Tạo state nội bộ để quản lý các ô input
  const [formData, setFormData] = useState({
    titleTask: "",
    detailTask: [],
    categoryTask: "",
    deadlineTask: new Date(),
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

  const handleSubTasksChange = (index, newValue) => {
    // Copy mảng subtasks cũ ra
    const updatedSubTasks = [...formData.detailTask];
    //Sửa title của phần tử tại vị trí index
    if (updatedSubTasks[index].title !== undefined) {
      updatedSubTasks[index].title = newValue;
    } else {
      updatedSubTasks[index].titleTask = newValue;
    }

    //Cập nhật lại state chung
    setFormData({
      ...formData,
      detailTask: updatedSubTasks,
    });
  };
  //onClick={(e) => e.stopPropagation()} vào cái Form (lớp bên trong).
  // Tại sao? Để khi bạn click vào ô input để gõ chữ, sự kiện click đó không "nổi bong bóng" (bubble) ra ngoài Overlay, tránh việc đang gõ thì form bị đóng.
  return (
    <div className="modal-overlay-for-update" onClick={onClose}>
      <div className="form-update" onClick={(e) => e.stopPropagation()}>
        <div className="content-top">
          <h1 id="update-title-text">Update your task</h1>
          <i className="fa-solid fa-pen"></i>
        </div>
        <div className="content-body">
          <div className="update-input-task-name">
            <label htmlFor="update-input-name">Task Name: </label>
            <input
              type="text"
              name="titleTask"
              id="update-input-name"
              placeholder="Update your name task"
              value={formData.titleTask}
              onChange={handleChange}
            />
          </div>
          <div className="update-sub-task">
            <label htmlFor="sub-task">Sub tasks: </label>
            {formData.detailTask && formData.detailTask.length > 0 ? (
              <div className="sub-tasks-list">
                {formData.detailTask.map((item, index) => (
                  <div className="sub-tasks-item" key={item.idTask || index}>
                    <input
                      type="text"
                      name=""
                      id=""
                      value={item.title}
                      onChange={(e) =>
                        handleSubTasksChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#888", fontStyle: "italic" }}>
                Không có subtask nào
              </p>
            )}
          </div>

          <div className="update-category-and-deadline">
            <div className="update-select-wrapper">
              <select
                className="update-category-select"
                name="categoryTask"
                value={formData.categoryTask}
                onChange={handleChange}
              >
                <option value="" disabled selected>
                  Category
                </option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            <div className="update-datepicker-wrapper">
              <p id="update-deadline-text">Deadline:</p>
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
                icon="fa fa-calendar" // Cần cài thêm Font Awesome nếu dùng
                // Hiển thị tháng và năm để chọn nhanh
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              ></DatePicker>
            </div>
          </div>
          <div className="btn-group">
            <Button>Update</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
