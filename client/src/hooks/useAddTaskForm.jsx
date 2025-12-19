import React from "react";

export const useAddTaskForm = () => {
  const pad = (num) => {
    return num.toString().padStart(2, "0");
  };

  const handleSubmitCreate = async ({ taskForm }, onClose) => {
    const formData = new FormData();
    formData.append("action", "add_task");
    formData.append("titleTask", taskForm.titleTask);
    formData.append("categoryTask", taskForm.categoryTask);
    formData.append("description", taskForm.description);

    if (taskForm.sub_tasks && taskForm.sub_tasks.length > 0) {
      formData.append("subtask", JSON.stringify(taskForm.sub_tasks));
    } else {
      formData.append("subtask", "[]");
    }

    // Xử lý Ngày tháng (Giữ nguyên logic của bạn)
    if (taskForm.deadlineTask instanceof Date) {
      const date = taskForm.deadlineTask;
      const Y = date.getFullYear();
      const M = pad(date.getMonth() + 1);
      const D = pad(date.getDate());
      const h = pad(date.getHours());
      const m = pad(date.getMinutes());
      const s = pad(date.getSeconds());

      const localDateTimeString = `${Y}-${M}-${D} ${h}:${m}:${s}`;
      formData.append("deadlineTask", localDateTimeString);
    }

    console.log("Sending data: ", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/taskApi.php", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        if (onClose) onClose(); // Đóng Modal và thường sẽ gọi refetch() ở đây
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("Error by get API!", err);
      alert("Lỗi kết nối máy chủ!");
    }
  };

  return { handleSubmitCreate };
};