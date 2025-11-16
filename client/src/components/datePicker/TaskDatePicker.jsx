import React from "react";
import DatePicker from "react-datepicker";
// Import CSS bắt buộc của react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";

export const TaskDatePicker = ({ selectedDate, onDateChange }) => {
  return (
    <>
      <h3>Deadline for task: </h3>
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
    </>
  );
};
