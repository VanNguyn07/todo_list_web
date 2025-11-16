<?php
class TaskModel
{
    private $connect;
    private $table_name = "add_task"; // <-- Tên bảng

    public function __construct($database)
    {
        $this->connect = $database;
    }

    public function insertTaskIntoDatabase($titleTask, $detailTask, $categoryTask, $deadlineTask)
    {
        // <-- Tên cột
        $sql = "INSERT INTO " . $this->table_name . "(titleTask, detailTask, categoryTask, deadlineTask) VALUES (?, ?, ?, ?)";

        $prepareStmt = mysqli_prepare($this->connect, $sql);

        if ($prepareStmt === false) {
            $error_message = mysqli_error($this->connect); // Lỗi sai tên bảng/cột
            return ['success' => false, 'message' => $error_message];
        }

        // Dùng "sssi" (string, string, string, integer)
        mysqli_stmt_bind_param($prepareStmt, "ssss", $titleTask, $detailTask, $categoryTask, $deadlineTask);

        if (mysqli_stmt_execute($prepareStmt)) {
            mysqli_stmt_close($prepareStmt);
            return ['success' => true];
        } else {
            $error_message = mysqli_stmt_error($prepareStmt); // Lỗi sai kiểu dữ liệu
            mysqli_stmt_close($prepareStmt);
            return ['success' => false, 'message' => $error_message];
        }
    }

    public function getNearestUpcomingTasks()
    {
        $sql = "SELECT * FROM " . $this->table_name . " 
            WHERE deadlineTask >= NOW() 
            ORDER BY deadlineTask ASC 
            LIMIT 4";

        // * WHERE deadlineTask >= NOW(): Chỉ lấy task chưa quá hạn.
        // * ORDER BY deadlineTask ASC: Sắp xếp task sắp tới hạn lên đầu.
        // * LIMIT 4: Chỉ lấy 4 task.
        $prepareStmt = mysqli_prepare($this->connect, $sql);

        if ($prepareStmt) {

            $execute = mysqli_stmt_execute($prepareStmt);
            if ($execute) {
                $result = mysqli_stmt_get_result($prepareStmt);
                $taskArray = [];

                while ($row = mysqli_fetch_assoc($result)) {
                    $taskArray[] = $row;
                }

                mysqli_stmt_close($prepareStmt);

                return $taskArray;
            }
        }

        return null;
    }

    public function deleteTaskById($taskId)
    {
        $sql = "DELETE FROM " . $this->table_name . " WHERE idTask = ?";
        $prepareStmt = mysqli_prepare($this->connect, $sql);
        mysqli_stmt_bind_param($prepareStmt, "i", $taskId);
        if (mysqli_stmt_execute($prepareStmt)) {
            mysqli_stmt_close($prepareStmt);
            return ['success' => true];
        } else {
            $error_message = mysqli_stmt_error($prepareStmt); // Lỗi sai kiểu dữ liệu
            mysqli_stmt_close($prepareStmt);
            return ['success' => false, 'message' => $error_message];
        }
    }
}
