import { useState, useEffect, useCallback } from "react"; // 1. Thêm useCallback

export const useFetchTasks = (actionType = 'get_all_task_list') => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Dùng useCallback để "gói" hàm fetch lại
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Xóa lỗi cũ (nếu có)
    
    try {
      const response = await fetch(`/api/fetchTaskApi.php?action=${actionType}`);  
      if(!response.ok){
        throw new Error(`Lỗi HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      if(data.success){
        const taskList = data.tasks || data.taskForm;
        setTasks(taskList);
      }else {
        throw new Error(data.message || "Lỗi không xác định từ API");
      }
    }catch(err){
      console.error("Error fetch ", err);
      setError(err.message);
    }finally{
      setIsLoading(false);
    }
  }, [actionType]); // useCallback với mảng rỗng

  // 3. useEffect bây giờ chỉ gọi hàm fetchTasks 1 lần lúc đầu
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Phụ thuộc vào fetchTasks (vẫn chỉ chạy 1 lần)

  // 4. Trả về thêm hàm fetchTasks để bên ngoài gọi
  return { tasks, isLoading, error, setTasks, refetch: fetchTasks };
};