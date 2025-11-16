import React, { useState } from "react";

export const useAddTask = ({ onSuccess }) => {
  // Hàm helper để thêm số 0 vào trước (ví dụ: 5 -> "05")
  const pad = (num) => {
    return num.toString().padStart(2, "0");
  };

  const [taskForm, setTaskForm] = useState({
    titleTask: "",
    detailTask: "",
    categoryTask: "",
    deadlineTask: null,
  });

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Hàm xử lý riêng cho DatePicker
  // react-datepicker sẽ trả về một Date object (hoặc null)
  const handleDateChange = (date) => {
    setTaskForm((prev) => ({
      ...prev,
      deadlineTask: date,
    }));
  };

  // 2. Hàm xử lý `fetch`
  const handleAddTask = () => {
    // Validation phía client (giữ nguyên)
    if (!taskForm.titleTask.trim()) {
      alert("Please enter a task title!");
      return;
    }
    if (!taskForm.detailTask.trim()) {
      alert("Please enter a task detail!");
      return;
    }
    if (!taskForm.categoryTask) {
      alert("Please select a task category!");
      return;
    }
    if (!taskForm.deadlineTask) {
      alert("Please select a task deadline!");
      return;
    }

    // Tạo FormData để gửi lên server (giữ nguyên)
    const formData = new FormData();
    formData.append("action", "add_task");
    formData.append("titleTask", taskForm.titleTask.trim());
    formData.append("detailTask", taskForm.detailTask.trim());
    formData.append("categoryTask", taskForm.categoryTask);

    //Chuyển Date object thành chuỗi ISO string (chuẩn UTC)
    if (taskForm.deadlineTask instanceof Date) {
      const date = taskForm.deadlineTask;
      // Lấy các thành phần theo giờ local (GMT+7)
      const Y = date.getFullYear();
      const M = pad(date.getMonth() + 1); // getMonth() bắt đầu từ 0
      const D = pad(date.getDate());
      const h = pad(date.getHours());
      const m = pad(date.getMinutes());
      const s = pad(date.getSeconds());

      // Tạo chuỗi YYYY-MM-DD HH:MM:SS
      const localDateTimeString = `${Y}-${M}-${D} ${h}:${m}:${s}`;

      formData.append("deadlineTask", localDateTimeString);
    }

    console.log("Sending data: ", Object.fromEntries(formData));

    try {
      const API_URL = "/api/addTaskApi.php";
      fetch(API_URL, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Lỗi HTTP! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert(data.message);
            setTaskForm({
              titleTask: "",
              detailTask: "",
              categoryTask: "",
              deadlineTask: null,
            });
            // 2. GỌI CALLBACK SAU KHI THÀNH CÔNG!
            if (onSuccess) {
              onSuccess(); // Đây chính là hàm refetch()
            }
          } else {
            alert(data.message || "Lỗi thêm task");
          }
        })
        .catch((error) => {
          console.error("Lỗi fetch:", error);
          alert("Lỗi kết nối: " + error.message);
        });
    } catch (error) {
      console.error("Lỗi khi thêm task:", error);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };
  return {
    taskForm,
    setTaskForm,
    handleInputChange,
    handleDateChange,
    handleAddTask,
  };
};
