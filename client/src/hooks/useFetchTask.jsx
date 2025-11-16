import { useState, useEffect, useCallback } from "react"; // 1. Thêm useCallback

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Dùng useCallback để "gói" hàm fetch lại
  const fetchTasks = useCallback(() => {
    setIsLoading(true);
    setError(null); // Xóa lỗi cũ (nếu có)
    
    fetch("/api/fetchTaskApi.php?action=get_nearest_tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setTasks(data.tasks);
        } else {
          setError(data.message || "Lỗi khi lấy dữ liệu từ API");
        }
      })
      .catch((err) => {
        console.error("Lỗi fetch:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // useCallback với mảng rỗng

  // 3. useEffect bây giờ chỉ gọi hàm fetchTasks 1 lần lúc đầu
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Phụ thuộc vào fetchTasks (vẫn chỉ chạy 1 lần)

  // 4. Trả về thêm hàm fetchTasks để bên ngoài gọi
  return { tasks, isLoading, error, refetch: fetchTasks };
};