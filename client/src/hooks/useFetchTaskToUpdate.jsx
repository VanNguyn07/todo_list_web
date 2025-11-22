import { useState, useEffect } from "react";

export const useFetchTaskToUpdate = () => {
  // 1. Chỉ giữ lại state cần thiết
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // 2. Tạo một hàm async riêng biệt bên trong useEffect
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/fetchTaskApi.php?action=get_task_to_update"
        );
        const data = await response.json();

        // 3. Kiểm tra logic success
        if (data.success) {
          setTasks(data.tasks);
        } else {
          console.error(data.message || "Lỗi API trả về false");
        }
      } catch (error) {
        console.error("Lỗi kết nối hoặc lỗi JSON:", error);
      }
    };

    // 4. Gọi hàm đó ngay lập tức
    fetchData();
  }, []); // [] để chỉ chạy 1 lần khi component mount

  // 5. Trả về dữ liệu
  return { tasks };
};