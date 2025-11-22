import React from "react";
import DatePicker from "react-datepicker";
import Button from "../button/Button";
import "./UpdateTask.css";
// Import CSS bắt buộc của react-datepicker
import "react-datepicker/dist/react-datepicker.css";
export const UpdateTask = ({ selectedDate, onDateChange }) => {
  return (
    <div className="form-update">
      <div className="content-top">
        <h1 id="update-title-text">Update your task</h1>
        <i className="fa-solid fa-pen"></i>
      </div>
      <div className="content-body">
        <div className="update-input-task-name">
          <label htmlFor="update-input-name">Task Name: </label>
          <input type="text" name="update-input-name" id="update-input-name" placeholder="Update your name task"/>
        </div>
        <div className="update-sub-task">Sub task</div>
        <div className="update-category-and-deadline">
          <div className="update-select-wrapper">
            <select className="update-category-select">
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
              selected={selectedDate}
              onChange={onDateChange}
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
  );
};
