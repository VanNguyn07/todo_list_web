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

    if(taskForm.detailTask && taskForm.detailTask.length > 0){
        // Chuyển mảng subtask thành chuỗi JSON
        formData.append("detailTask", JSON.stringify(taskForm.detailTask))
    }else {
        formData.append("detailTask", "[]");
    }

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

    formData.append("description", taskForm.description);

    console.log("Sending data: ", Object.fromEntries(formData));

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
        throw new Error(data.message || "Add failed!");
      }
    } catch (err) {
      console.log("Error by get API!", err);
    }
  };
  return { handleSubmitCreate };
};
