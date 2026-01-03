import { useState } from 'react';

// Hook này nhận 1 tham số: { onSuccess }
// (onSuccess chính là hàm 'refetch' mà 'useFetchTasks' cung cấp)
export const useDeleteTask = ({ onSuccess }) => {

    // State để biết nó đang xóa (có thể dùng để vô hiệu hóa nút)
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    // Hàm handleDelete giờ nằm trong hook
    const handleDelete = (idTask) => {
        // Hỏi xác nhận
        // nút cancel = false, !false = true => chạy if 
        if (!window.confirm("Are your sure want to delete this task?")) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        // Chuẩn bị FormData
        const formData = new FormData();
        formData.append('action', 'delete_task');
        formData.append('taskId', idTask);

        // Gọi API
        fetch('/api/taskApi.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                // 1. GỌI CALLBACK ĐỂ BÁO CHO 'useFetchTasks' TẢI LẠI
                if (onSuccess) {
                    onSuccess(); // Chính là gọi refetch()
                }
            } else {
                setError(data.message);
                alert(data.message);
            }
        })
        .catch(err => {
            setError(err.message);
            alert("Lỗi kết nối khi xóa task.");
        })
        .finally(() => {
            // Xóa xong (dù lỗi hay thành công)
            setIsDeleting(false);
        });
    };

    // 2. Trả về hàm và các trạng thái
    return { handleDelete, isDeleting, error };
};