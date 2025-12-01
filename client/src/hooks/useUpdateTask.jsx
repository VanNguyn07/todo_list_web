import React from "react";
export const useUpdateTask = () => {
  const handleSubmitUpdate = async ({ idTask, taskForm }, onClose) => {
    // Hàm helper để thêm số 0 vào trước (ví dụ: 5 -> "05")
    const pad = (num) => {
      return num.toString().padStart(2, "0");
    };

    const formData = new FormData();
    formData.append("action", "update_task");
    formData.append("idTask", idTask);
    formData.append("titleTask", taskForm.titleTask);
    formData.append("categoryTask", taskForm.categoryTask);
    formData.append("detailTask", JSON.stringify(taskForm.detailTask));
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
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        //update thành công thì đóng form 
        if(onClose){
            onClose();
        }
      } else {
        throw new Error(data.message || "Update thất bại");
      }
    } catch (err) {
      console.log("Lỗi trong Hook:", err);
    }
  };
  return { handleSubmitUpdate };
};
