import React from "react";

export const useUsersManager = (setUsers) => {
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "deactivated" : "active";

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );

    try {
      const formData = new FormData();
      formData.append("action", "toggle_status");
      formData.append("userId", userId);
      formData.append("status", newStatus);

      const response = await fetch("/api/adminApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.success) {
        alert("error: " + data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: currentStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      // Revert lại nếu lỗi mạng
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: currentStatus } : user
        )
      );
    }
  };
  return {
    handleToggleStatus
  }
};
