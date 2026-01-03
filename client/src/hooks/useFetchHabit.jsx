import { useState, useEffect, useCallback } from "react"; // 1. Thêm useCallback

export const useFetchHabit = () => {
  const [habits, setHabits] = useState([]);

  // 2. Dùng useCallback để "gói" hàm fetch lại
  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch(`/api/fetchHabitApi.php?action=get_all_habit`);  
      if(!response.ok){
        throw new Error(`Lỗi HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      if(data.success){
        const habitList = data.habitForm;
        setHabits(habitList);
      }else {
        throw new Error(data.message || "Lỗi không xác định từ API");
      }
    }catch(err){
      console.error("Error fetch ", err);
    }
  },[]); // useCallback với mảng rỗng

  // 3. useEffect bây giờ chỉ gọi hàm fetchTasks 1 lần lúc đầu
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]); // Phụ thuộc vào fetchTasks (vẫn chỉ chạy 1 lần)

  // 4. Trả về thêm hàm fetchTasks để bên ngoài gọi
  return { habits, setHabits, refetch: fetchHabits };
};