import React, { useState } from "react";

export const useAddTask = () => {
  const [taskForm, setTaskForm] = useState({
    titleTask: "",
    detailTask: "",
    categoryTask: "",
    priorityTask: "",
  });

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 2. Hàm xử lý `fetch`
  const handleAddTask = () => {
    // Validation phía client (giữ nguyên)
    if (!taskForm.titleTask.trim()) {
      alert("Vui lòng nhập tiêu đề task!");
      return;
    }
    if (!taskForm.detailTask.trim()) {
      alert("Vui lòng nhập chi tiết task!");
      return;
    }
    if (!taskForm.categoryTask) {
      alert("Vui lòng chọn danh mục!");
      return;
    }
    if (!taskForm.priorityTask) {
      alert("Vui lòng chọn độ ưu tiên!");
      return;
    }

    // Tạo FormData để gửi lên server (giữ nguyên)
    const formData = new FormData();
    formData.append("action", "add_task");
    formData.append("titleTask", taskForm.titleTask.trim());
    formData.append("detailTask", taskForm.detailTask.trim());
    formData.append("categoryTask", taskForm.categoryTask.trim());
    formData.append("priorityTask", taskForm.priorityTask.trim());

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
              priorityTask: "",
            });
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
    handleInputChange,
    handleAddTask,
  };
};
