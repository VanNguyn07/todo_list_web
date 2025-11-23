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
  });

  const [subTask, setSubTask] = useState([]);// Mảng chứa các task con
  const [currentDetailInput, setCurrentDetailInput] = useState("");// Nội dung đang gõ trong ô Detail

  // Xử lý input text thường (Title, Category...)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailChange = (e) => {
    setCurrentDetailInput(e.target.value);
  };

  // Xử lý khi nhấn phím (Bắt sự kiện Enter)
  const handleWhenClickEnter = (e) => {
    if(e.key === "Enter") {
      e.preventDefault(); // Chặn xuống dòng mặc định của textarea/input
      if(!currentDetailInput.trim()){
        return;
      }

      const newSub = {
        id:Date.now(),// ID tạm để React render key
        title:currentDetailInput.trim(),
        completed: false,
      }

      setSubTask([...subTask, newSub]);
      setCurrentDetailInput("");
    }
  }

  const removeSubTask = (id) => {
    setSubTask(subTask.filter(task => task.id !== id));
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
    if (subTask.length === 0 && !currentDetailInput.trim()) {
      alert("Please enter at least one detail/sub-task!");
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

    let finalSubTasks = [...subTask];
    if(currentDetailInput.trim()){
      finalSubTasks.push({
        id: Date.now(),
        title: currentDetailInput.trim(),
        completed: false,
      })
    }
    // Tạo FormData để gửi lên server (giữ nguyên)
    const formData = new FormData();
    formData.append("action", "add_task");
    formData.append("titleTask", taskForm.titleTask.trim());
    formData.append("categoryTask", taskForm.categoryTask);
    formData.append("detailTask", JSON.stringify(finalSubTasks));

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
      const API_URL = "/api/taskApi.php";
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
              categoryTask: "",
              deadlineTask: null,
            });
            setSubTask([]);
            setCurrentDetailInput("");
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
    subTask,
    currentDetailInput,
    setTaskForm,
    handleInputChange,
    handleDateChange,
    handleAddTask,
    handleWhenClickEnter,
    handleDetailChange,
    removeSubTask,
  };
};
