import React from "react";
export const updateTaskStatus = ({onsuccess}) => {
  const handleSubmitCompleted = async (id, currentStatus, type = "parent") => {

    const newStatus = currentStatus === "true" || currentStatus === true ? "false" : "true";

    const formData = new FormData();
    formData.append("action", "is_completed");
    formData.append("id", id);
    formData.append("completed", newStatus);
    formData.append("type", type)// Gửi "parent" hoặc "sub"

    try {
      const response = await fetch("/api/taskApi.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        if(onsuccess){
            onsuccess();// Chính là gọi refetch()
        }
      } else {
        throw new Error(data.message || "Update status completed failed");
      }
    } catch (err) {
      console.log("Lỗi trong Hook:", err);
    }
  };
  return {handleSubmitCompleted}
};
