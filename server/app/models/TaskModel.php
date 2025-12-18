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
    public function insertTaskIntoDatabase($title, $detail, $category, $deadline, $description)
    {
        
        $sql = "INSERT INTO " . $this->table_name . " (titleTask, detailTask, categoryTask, deadlineTask, description) VALUES (?, ?, ?, ?, ?)";

        try {
            $stmt = $this->pdo->prepare($sql);

            // PDO không cần "ssss" loằng ngoằng, chỉ cần truyền mảng vào execute là xong
            $result = $stmt->execute([$title, $detail, $category, $deadline, $description]);

            if ($result) {
                return ['success' => true];
            }
            return ['success' => false, 'message' => 'Can not add task'];
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

    public function getAllTaskList()
    {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE deadlineTask >= NOW() ORDER BY deadlineTask ASC";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute();
            $tasksFormDb = $prepareStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($tasksFormDb as &$task) {
                $task['detailTask'] = !empty($task['detailTask']) ? json_decode($task['detailTask']) : [];
                $task['completed'] = ($task['completed'] === 'true');
                $task['expanded'] = ($task['expanded'] === 'true');
            }
            return ['success' => true, 'data' => $tasksFormDb]; 
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
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

    public function fetchDataForUpdate($idTask)
    {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE idTask = ? LIMIT 1";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute([$idTask]);
            return $prepareStmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException) {
            return [];
        }
    }

    public function updateTaskById($titleTask, $detailTask, $categoryTask, $deadlineTask, $description, $idTask)
    {
        // Sửa lại chuỗi SQL cho chuẩn
        $sql = "UPDATE " . $this->table_name . " SET 
            titleTask = ?, 
            detailTask = ?,      
            categoryTask = ?, 
            deadlineTask = ?,
            description = ?
            WHERE idTask = ?";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            // Execute trả về true/false
            $isSuccess = $prepareStmt->execute([$titleTask, $detailTask, $categoryTask, $deadlineTask, $description, $idTask]);

            if ($isSuccess) {
                return ['success' => true, 'message' => 'Update successfully!'];
            } else {
                return ['success' => false, 'message' => 'Execute failed!'];
            }
        } catch (PDOException $e) {
            // Ghi log lỗi ra để debug
            error_log("SQL Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
