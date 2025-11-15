<?php
class AddTaskModel
{
    private $connect;
    private $table_name = "add_task"; // <-- Tên bảng

    public function __construct($database)
    {
        $this->connect = $database;
    }

    function insertTaskIntoDatabase($titleTask, $detailTask, $categoryTask, $priorityTask)
    {
        // <-- Tên cột
        $sql = "INSERT INTO " . $this->table_name . "(titleTask, detailTask, categoryTask, priorityTask) VALUES (?, ?, ?, ?)";
        
        $prepareStmt = mysqli_prepare($this->connect, $sql);

        if ($prepareStmt === false) {
            $error_message = mysqli_error($this->connect); // Lỗi sai tên bảng/cột
            return ['success' => false, 'message' => $error_message];
        }

        $priorityInt = (int)$priorityTask; // Chuyển "1" thành 1

        // Dùng "sssi" (string, string, string, integer)
        mysqli_stmt_bind_param($prepareStmt, "sssi", $titleTask, $detailTask, $categoryTask, $priorityInt);

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
?>