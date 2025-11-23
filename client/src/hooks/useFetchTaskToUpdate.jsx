import React, { useState } from "react";

export const useFetchTaskToUpdate = () => {
  // 1. Chỉ giữ lại state cần thiết
  const [taskToUpdate, setTasks] = useState(null);
  const [isShowFormUpdate, setIsShowFormUpdate] = useState(false);

  const handleUpdate = async (idTask) => {
    console.log("Received idTask is: ", idTask);
    try {
      const response = await fetch(
        `/api/fetchTaskApi.php?action=get_task_to_update&idTask=${idTask}`
      );
      const data = await response.json();

      if (data.success) {
        setTasks(data.tasks);
        setIsShowFormUpdate(true);
        console.log("Data when success is: ", data.tasks);
      } else {
        console.error(data.message || "Lỗi API trả về false");
      }
    } catch (er) {
      console.error("Lỗi kết nối hoặc lỗi JSON:", er);
    }
  };

  const handleCloseFormUpdate = () => {
    setIsShowFormUpdate(false);
    setTasks(null);
  };
  // 5. Trả về dữ liệu
  return {
    taskToUpdate,
    handleUpdate,
    isShowFormUpdate,
    handleCloseFormUpdate,
  };
};
