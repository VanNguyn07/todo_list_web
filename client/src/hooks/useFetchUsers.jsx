import { useState, useEffect, useCallback } from "react"; // 1. Thêm useCallback

export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);

  // 2. Dùng useCallback để "gói" hàm fetch lại
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/fetchUserApi.php?action=get_all_users`);  
      if(!response.ok){
        throw new Error(`Lỗi HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      if(data.success){
        const usersList = data.result;
        setUsers(usersList);
      }else {
        throw new Error(data.message || "Lỗi không xác định từ API");
      }
    }catch(err){
      console.error("Error fetch ", err);
    }
  },[]); // useCallback với mảng rỗng

  // 3. useEffect bây giờ chỉ gọi hàm fetchTasks 1 lần lúc đầu
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Phụ thuộc vào fetchTasks (vẫn chỉ chạy 1 lần)

  // 4. Trả về thêm hàm fetchTasks để bên ngoài gọi
  return { users, setUsers, refetch: fetchUsers };
};