import React, { useState } from "react";

export const useAddTask = ({ onSuccess }) => {
  // Hàm helper để thêm số 0 vào trước (ví dụ: 5 -> "05")
  const pad = (num) => {
    return num.toString().padStart(2, "0");
  };

  const [taskForm, setTaskForm] = useState({
    titleTask: "",
    categoryTask: "",
    deadlineTask: null,
    description: "",
  });

  const [subTask, setSubTask] = useState([]);// Mảng chứa các task con
  const [currentSubTask, setCurrentSubTask] = useState("");// Nội dung đang gõ trong ô Detail

  // Xử lý input text thường (Title, Category...)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubTaskChange = (e) => {
    setCurrentSubTask(e.target.value);
  };

  // Xử lý khi nhấn phím (Bắt sự kiện Enter)
  const handleWhenClickEnter = (e) => {
    if(e.key === "Enter") {
      e.preventDefault(); // Chặn xuống dòng mặc định của textarea/input
      if(!currentSubTask.trim()){
        return;
      }

      const newSub = {
        id: Date.now(),
        content:currentSubTask.trim(),
        completed: 'false',
      }

      setSubTask([...subTask, newSub]);
      setCurrentSubTask("");
    }
  }

  const removeSubTask = (idToremove) => {
    setSubTask(subTask.filter(sub => sub.id !== idToremove));
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
  const handleAddTask = async () => {
    // Validation phía client (giữ nguyên)
    if (!taskForm.titleTask.trim()) {
      alert("Please enter a task title!");
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
    formData.append("categoryTask", taskForm.categoryTask);
    formData.append("subTask", JSON.stringify(subTask))

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
      formData.append("description", taskForm.description);
    }

    console.log("Sending data: ", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/taskApi.php", {
        method: "POST",
        body: formData
      })

      const data = await response.json();
      if (data.success) {
            alert(data.message);
            setTaskForm({
              titleTask: "",
              categoryTask: "",
              deadlineTask: null,
            });
            setSubTask([]);
            setCurrentSubTask("");
            // 2. GỌI CALLBACK SAU KHI THÀNH CÔNG!
            if (onSuccess) {
              onSuccess(); // Đây chính là hàm refetch()
            }
          } else {
            alert(data.message || "Lỗi thêm task");
          }
    } catch(error) {
      console.error("Lỗi khi thêm task:", error);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };
  return {
    taskForm,
    subTask,
    currentSubTask,
    setTaskForm,
    handleInputChange,
    handleDateChange,
    handleAddTask,
    handleWhenClickEnter,
    handleSubTaskChange,
    removeSubTask,
  };
};
