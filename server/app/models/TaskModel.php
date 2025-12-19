<?php
class TaskModel
{
    private $pdo; // Đổi tên biến thành pdo cho dễ hiểu
    private $table_tasks = "tasks";
    private $table_sub_tasks = "sub_tasks";

    // Constructor nhận vào kết nối PDO
    public function __construct($database)
    {
        $this->pdo = $database;
    }

    // 1. Thêm công việc mới
    public function insertParentTask($title, $category, $deadline, $description)
    {

        $sql = "INSERT INTO " . $this->table_tasks . " (titleTask, categoryTask, deadlineTask, description) VALUES (?, ?, ?, ?)";

        try {
            $stmt = $this->pdo->prepare($sql);

            // PDO không cần "ssss" loằng ngoằng, chỉ cần truyền mảng vào execute là xong
            $result = $stmt->execute([$title, $category, $deadline, $description]);

            if ($result) {
                return ['success' => true, 'idTask' => $this->pdo->lastInsertId()];
            }
            return ['success' => false, 'message' => 'Can not add task'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function insertSubTask($idNewParent, $content)
    {

        $sql = "INSERT INTO " . $this->table_sub_tasks . " (idParent, content) VALUES (?, ?)";

        try {
            $stmt = $this->pdo->prepare($sql);

            // PDO không cần "ssss" loằng ngoằng, chỉ cần truyền mảng vào execute là xong
            $result = $stmt->execute([$idNewParent, $content]);

            if ($result) {
                return ['success' => true];
            }
            return ['success' => false, 'message' => 'Can not add sub task'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function checkTitleTask($titleTask)
    {
        $sql = "SELECT idTask FROM " . $this->table_tasks . " WHERE titleTask = ? LIMIT 1";

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
        $sql = "SELECT idTask FROM " . $this->table_tasks . " WHERE titleTask = ? LIMIT 1";
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
        $sql = "SELECT * FROM " . $this->table_tasks . " 
                WHERE deadlineTask >= NOW() AND completed = 'false'
                ORDER BY deadlineTask ASC 
                LIMIT 4";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $tasksFormDb = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sqlSub = "SELECT * FROM " . $this->table_sub_tasks . " WHERE idParent = ?";
            $stmtSub = $this->pdo->prepare($sqlSub);

            foreach ($tasksFormDb as &$task) {
                $stmtSub->execute([$task['idTask']]);

                $task['sub_tasks'] = $stmtSub->fetchAll(PDO::FETCH_ASSOC);
            }
            unset($task);
            return ['success' => true, 'data' => $tasksFormDb];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getAllTaskList()
    {
        $sql = "SELECT * FROM " . $this->table_tasks . " WHERE deadlineTask >= NOW() ORDER BY deadlineTask ASC";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute();
            $tasksFormDb = $prepareStmt->fetchAll(PDO::FETCH_ASSOC);

            //Với mỗi Task, đi lấy Sub-tasks của nó
            $sqlSub = "SELECT * FROM " . $this->table_sub_tasks . " WHERE idParent = ? ";
            $prepareStmtSub = $this->pdo->prepare($sqlSub);
            foreach ($tasksFormDb as &$task) {
                $prepareStmtSub->execute([$task['idTask']]);

                $task['sub_tasks'] = $prepareStmtSub->fetchAll(PDO::FETCH_ASSOC);
            }
            return ['success' => true, 'data' => $tasksFormDb];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    // 3. Xóa công việc
    public function deleteTaskById($idTask)
    {
        $sqlSub = "DELETE FROM " . $this->table_sub_tasks . " WHERE idParent = ?";
        $prepareStmtSub = $this->pdo->prepare($sqlSub);
        $prepareStmtSub->execute([$idTask]);

        $sql = "DELETE FROM " . $this->table_tasks . " WHERE idTask = ?";
        try {
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([$idTask]); // Truyền ID vào dấu ?

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
        $sql = "SELECT * FROM " . $this->table_tasks . " WHERE idTask = ? LIMIT 1";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute([$idTask]);
            $task = $prepareStmt->fetch(PDO::FETCH_ASSOC);
            if($task){
                $sqlSub = "SELECT * FROM " . $this->table_sub_tasks . " WHERE idParent = ?";
                $stmtSub = $this->pdo->prepare($sqlSub);
                $stmtSub->execute([$idTask]);
            
                $task['sub_tasks'] = $stmtSub->fetchAll(PDO::FETCH_ASSOC);
                return $task;
            }
        } catch (PDOException) {
            return [];
        }
    }

public function updateTaskById($idTask, $titleTask, $categoryTask, $deadlineTask, $description, $subTasks) {
    try {
        $this->pdo->beginTransaction();

        // 1. Update Task cha
        $sqlParent = "UPDATE " . $this->table_tasks . " SET 
            titleTask = ?, categoryTask = ?, deadlineTask = ?, description = ?
            WHERE idTask = ?";
        $this->pdo->prepare($sqlParent)->execute([$titleTask, $categoryTask, $deadlineTask, $description, $idTask]);

        // 2. Lấy danh sách ID cũ để so sánh (Phục vụ việc XÓA)
        $keepIds = [];
        if (!empty($subTasks)) {
            foreach ($subTasks as $sub) {
                // Chỉ những cái có idSubTask là số (từ DB cũ) mới đi UPDATE
                if (isset($sub['idSubTask']) && is_numeric($sub['idSubTask'])) {
                    $sqlUp = "UPDATE " . $this->table_sub_tasks . " SET content = ?, completed = ? WHERE idSubTask = ?";
                    $status = ($sub['completed'] === "true" || $sub['completed'] === true) ? 'true' : 'false';
                    $this->pdo->prepare($sqlUp)->execute([$sub['content'], $status, $sub['idSubTask']]);
                    $keepIds[] = $sub['idSubTask'];
                } else {
                    $sqlIn = "INSERT INTO " . $this->table_sub_tasks . " (idParent, content, completed) VALUES (?, ?, 'false')";
                    $this->pdo->prepare($sqlIn)->execute([$idTask, $sub['content']]);
                    $keepIds[] = $this->pdo->lastInsertId();
                }
            }
        }

        // 3. XÓA các subtask đã bị người dùng nhấn icon Thùng rác (Xóa khỏi giao diện)
        if (!empty($keepIds)) {
            $placeholders = implode(',', array_fill(0, count($keepIds), '?'));
            $sqlDel = "DELETE FROM " . $this->table_sub_tasks . " WHERE idParent = ? AND idSubTask NOT IN ($placeholders)";
            $this->pdo->prepare($sqlDel)->execute(array_merge([$idTask], $keepIds));
        }

        $this->pdo->commit();
        return ['success' => true, 'message' => 'Update DB successfully!'];
    } catch (Exception $e) {
        $this->pdo->rollBack();
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

    public function updateSubTaskStatus($completed, $idSubTask)
    {
        $isCompleted = filter_var($completed, FILTER_VALIDATE_BOOLEAN);
        $status = $isCompleted ? 'true' : 'false';

        $sql = "UPDATE " . $this->table_sub_tasks . " SET completed = ? WHERE idSubTask = ?";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $isSuccess = $prepareStmt->execute([$status, $idSubTask]);
            if ($isSuccess) {
                $sqlGetIdParent = "SELECT idParent FROM " . $this->table_sub_tasks . " WHERE idSubTask = ?";
                $stmtGetParent = $this->pdo->prepare($sqlGetIdParent);
                $stmtGetParent->execute([$idSubTask]);
                //Lấy dữ liệu ra 
                $subTaskData = $stmtGetParent->fetch(PDO::FETCH_ASSOC);
                $idParentTask = $subTaskData['idParent'];

                if ($isCompleted) {
                    // check Task con nào khác chưa xong không?
                    $sqlCheck = "SELECT COUNT(*) as remaining FROM " . $this->table_sub_tasks . " WHERE idParent = ? AND completed = 'false'";
                    $stmtCheck = $this->pdo->prepare($sqlCheck);
                    $stmtCheck->execute([$idParentTask]);
                    $result = $stmtCheck->fetch();


                    if ($result['remaining'] == 0) {
                        $sqlParent = "UPDATE " . $this->table_tasks . " SET completed = 'true' WHERE idTask = ?";
                        $this->pdo->prepare($sqlParent)->execute([$idParentTask]);
                    }
                } else {
                    // if Task con bị đổi thành 'false', thì Task cha cũng phải thành 'false'
                    $sqlParent = "UPDATE " . $this->table_tasks . " SET completed = 'false' WHERE idTask = ?";
                    $this->pdo->prepare($sqlParent)->execute([$idParentTask]);
                }
                return ['success' => true, 'message' => 'Update successfully!'];
            } else {
                return ['success' => false, 'message' => 'Execute failed!'];
            }
        } catch (PDOException $e) {
            error_log("SQL Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateParentTaskStatus($completed, $idParentTask)
    {
        $isCompleted = filter_var($completed, FILTER_VALIDATE_BOOLEAN);
        $status = $isCompleted ? 'true' : 'false';

        $sql = "UPDATE " . $this->table_tasks . " SET completed = ? WHERE idTask = ?";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $isSuccess = $prepareStmt->execute([$status, $idParentTask]);
            if ($isSuccess) {
                if ($isCompleted) {
                    $sqlChildren = "UPDATE " . $this->table_sub_tasks . " SET completed = ? WHERE idParent = ?";
                    $stmtChildren = $this->pdo->prepare($sqlChildren);
                    $stmtChildren->execute([$status, $idParentTask]);
                }
                return ['success' => true, 'message' => 'Update successfully!'];
            } else {
                return ['success' => false, 'message' => 'Execute failed!'];
            }
        } catch (PDOException $e) {
            error_log("SQL Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
