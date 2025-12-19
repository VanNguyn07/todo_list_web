import React from "react";

export const useUpdateTask = () => {
  const handleSubmitUpdate = async ({ idTask, taskForm }, onClose) => {
    const pad = (num) => {
      return num.toString().padStart(2, "0");
    };

    const formData = new FormData();
    formData.append("action", "update_task");
    formData.append("idTask", idTask);
    formData.append("titleTask", taskForm.titleTask);
    formData.append("categoryTask", taskForm.categoryTask);
    formData.append("subTask", JSON.stringify(taskForm.sub_tasks));

    // Xử lý Ngày tháng
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
    } else if (typeof taskForm.deadlineTask === "string") {
      // Nếu là string (từ DB đổ ra), giữ nguyên giá trị
      formData.append("deadlineTask", taskForm.deadlineTask);
    }

    // FIX 2: Đưa description ra ngoài khối "if deadlineTask" 
    // Nếu để bên trong, khi task không có deadline, description sẽ bị mất.
    formData.append("description", taskForm.description || "");

    console.log("Sending update data: ", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/taskApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        if (onClose) onClose();
      } else {
        throw new Error(data.message || "Update thất bại");
      }
    } catch (err) {
      console.log("Lỗi trong Hook update:", err);
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  return { handleSubmitUpdate };
};