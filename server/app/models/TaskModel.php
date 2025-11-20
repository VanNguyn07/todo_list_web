<?php
class TaskModel
{
    private $pdo; // Đổi tên biến thành pdo cho dễ hiểu
    private $table_name = "tasks"; // ⚠️ Đảm bảo tên bảng trong DB là 'tasks'

    // Constructor nhận vào kết nối PDO
    public function __construct($database)
    {
        $this->pdo = $database;
    }

    // 1. Thêm công việc mới
    public function insertTaskIntoDatabase($title, $detail, $category, $deadline)
    {
        // ⚠️ Lưu ý: Kiểm tra lại tên cột trong DB của bạn xem đã đổi thành title, description... chưa
        // hay vẫn là titleTask, detailTask. Dưới đây mình để theo tên cũ trong code của bạn:
        $sql = "INSERT INTO " . $this->table_name . " (titleTask, detailTask, categoryTask, deadlineTask) VALUES (?, ?, ?, ?)";

        try {
            $stmt = $this->pdo->prepare($sql);

            // PDO không cần "ssss" loằng ngoằng, chỉ cần truyền mảng vào execute là xong
            $result = $stmt->execute([$title, $detail, $category, $deadline]);

            if ($result) {
                return ['success' => true];
            }
            return ['success' => false, 'message' => 'Không thể thêm task'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function checkTitleTask($titleTask)
    {
        $sql = "SELECT idTask FROM " . $this->table_name . " WHERE titleTask = ? LIMIT 1";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute([$titleTask]);

            // Nếu rowCount > 0 nghĩa là tìm thấy -> Đã tồn tại
            if ($prepareStmt->rowCount() > 0) {
                return "ERR_TITLETASK_EXISTS";
            }

            return "NOT_FOUND";
        } catch (PDOException $e) {
            // Ghi log lỗi thực tế để debug nếu cần: error_log($e->getMessage());
            return "ERROR_DB";
        }
    }

    public function searchTaskByTitle($titleTask)
    {
        $sql = "SELECT idTask FROM " . $this->table_name . " WHERE titleTask = ? LIMIT 1";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute([$titleTask]);

            if ($prepareStmt->rowCount() > 0) {
                return "SEARCH_SUCCESS";
            }
            return "NOT_FOUND";
        } catch (PDOException $e) {
            return "ERROR_DB";
        }
    }

    // 2. Lấy danh sách công việc sắp tới
    public function getNearestUpcomingTasks()
    {
        $sql = "SELECT * FROM " . $this->table_name . " 
                WHERE deadlineTask >= NOW() 
                ORDER BY deadlineTask ASC 
                LIMIT 4";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            // PDO lấy dữ liệu cực nhanh bằng fetchAll
            // PDO::FETCH_ASSOC nghĩa là chỉ lấy key theo tên cột, không lấy số thứ tự
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return []; // Trả về mảng rỗng nếu lỗi
        }
    }

    // 3. Xóa công việc
    public function deleteTaskById($taskId)
    {
        // Giả sử cột ID của bạn là idTask (nếu đã đổi thành id thì sửa lại nhé)
        $sql = "DELETE FROM " . $this->table_name . " WHERE idTask = ?";

        try {
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([$taskId]); // Truyền ID vào dấu ?

            if ($result) {
                return ['success' => true];
            }
            return ['success' => false, 'message' => 'Xóa thất bại'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
