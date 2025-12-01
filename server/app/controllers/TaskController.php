    <?php
    header('Content-Type: application/json');
    class TaskController
    {
        // create a Associative Array hay là mảng kết hợp lưu theo Key => Value
        public $response = ['success' => false, 'message' => ''];
        private $taskModel;

        // hàm constructor sẽ được tự động gọi khi use new 
        public function __construct($database)
        {
            $this->taskModel = new TaskModel($database);
        }

        public function handleInsertTaskIntoDb()
        {
            // Lấy dữ liệu từ POST
            $titleTask = trim($_POST['titleTask'] ?? '');
            $detailTask = trim($_POST['detailTask'] ?? '');
            $categoryTask = trim($_POST['categoryTask'] ?? '');
            $deadlineTask = trim($_POST['deadlineTask'] ?? '');

            // Validation
            if (empty($titleTask)) {
                $this->response['message'] = 'Please enter a task title!';
                $this->response['field'] = 'titleTask';
                echo json_encode($this->response);
                exit();
            }

            if (empty($detailTask)) {
                $this->response['message'] = 'Please enter a task detail!';
                $this->response['field'] = 'detailTask';
                echo json_encode($this->response);
                exit();
            }

            if (empty($categoryTask)) {
                $this->response['message'] = 'Please select a task category!';
                $this->response['field'] = 'categoryTask';
                echo json_encode($this->response);
                exit();
            }

            if (empty($deadlineTask)) {
                $this->response['message'] = 'Please select a task deadline!';
                $this->response['field'] = 'deadlineTask';
                echo json_encode($this->response);
                exit();
            }

            try {
                // Chuỗi ISO (ví dụ: "2025-11-20T10:30:00.000Z")
                // PHP có thể đọc trực tiếp bằng new DateTime()
                new DateTime($deadlineTask);
            } catch (Exception $e) {
                $this->response['message'] = 'Định dạng ngày hết hạn không hợp lệ!';
                $this->response['field'] = 'deadlineTask';
                echo json_encode($this->response);
                exit();
            }

            $checkDublicateTitleTask = $this->taskModel->checkTitleTask($titleTask);

            if ($checkDublicateTitleTask === "ERR_TITLETASK_EXISTS") {
                $this->response['message'] = 'Title Task already exists!';
                $this->response['field'] = 'titleTask';
                echo json_encode($this->response);
                exit();
            }
            // Thêm xử lý lỗi DB
            if ($checkDublicateTitleTask === "ERROR_DB") {
                $this->response['message'] = 'Database error while checking duplicate!';
                echo json_encode($this->response);
                exit();
            }

            if ($checkDublicateTitleTask === "NOT_FOUND") {
                // Gọi Model để insert vào database
                $isSuccess = $this->taskModel->insertTaskIntoDatabase(
                    $titleTask,
                    $detailTask,
                    $categoryTask,
                    $deadlineTask
                );

                if ($isSuccess) {
                    $this->response['success'] = true;
                    $this->response['message'] = 'Add task successfully!';
                } else {
                    $this->response['message'] = 'Lỗi CSDL: ' . $isSuccess['message'];
                }

                echo json_encode($this->response);
                exit();
            }
        }

        public function handleSelectAllDataFromDb()
        {
            $tasks = $this->taskModel->getNearestUpcomingTasks();
            if ($tasks !== null) {
                // 2. Trả về JSON thành công
                $this->response['success'] = true;
                $this->response['tasks'] = $tasks;
            } else {
                // 3. Trả về JSON lỗi
                $this->response['message'] = 'Lỗi khi lấy danh sách task';
            }

            echo json_encode($this->response);
            exit();
        }

        public function handleGetAllTaskList(){
            $taskForm = $this->taskModel->getAllTaskList();
            if($taskForm !== null){
                $this->response['success'] = true;
                $this->response['taskForm'] = $taskForm['data'];
            }else {
                $this->response['message'] = "Lỗi khi lấy danh sách task";
            }

            echo json_encode($this->response);
            exit();
        }

        public function handleDeleteTask()
        {
            // Lấy dữ liệu từ POST
            $taskId = trim($_POST['taskId'] ?? 0);

            if (empty($taskId) || !is_numeric($taskId)) {
                $this->response['message'] = 'ID của task không hợp lệ!';
                echo json_encode($this->response);
                exit();
            }

            $result = $this->taskModel->deleteTaskById($taskId);

            if ($result['success']) {
                $this->response['success'] = true;
                $this->response['message'] = 'Xóa task thành công!';
            } else {
                $this->response['message'] = 'Lỗi CSDL: ' . $result['message'];
            }
            echo json_encode($this->response);
            exit();
        }

        public function handleUpdateTask($idTask)
        {
            $titleTask = trim($_POST['titleTask'] ?? '');
            $detailTask = trim($_POST['detailTask'] ?? '');
            $categoryTask = trim($_POST['categoryTask'] ?? '');
            $deadlineTask = trim($_POST['deadlineTask'] ?? '');
            $description = trim($_POST['description'] ?? '');

            $result = $this->taskModel->updateTaskById($titleTask, $detailTask, $categoryTask, $deadlineTask, $description, $idTask);

            // Expecting $result to be an array with 'success' boolean
            if (is_array($result) && isset($result['success']) && $result['success'] === true) {
                $this->response['success'] = true;
                $this->response['message'] = "Update your task successfully!";
            } else {
                $this->response['success'] = false;
                $errMsg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown DB error';
                $this->response['message'] = 'Lỗi DB: ' . $errMsg;
            }

            echo json_encode($this->response);
            exit();
        }

        public function handleGetTasksToUpdate($idTask)
        {
            $result = $this->taskModel->fetchDataForUpdate($idTask);
            if ($result !== null) {
                // 2. Trả về JSON thành công
                $this->response['success'] = true;
                $this->response['tasks'] = $result;
            } else {
                // 3. Trả về JSON lỗi
                $this->response['message'] = 'Lỗi khi lấy danh sách task';
            }

            echo json_encode($this->response);
            exit();
        }

        /**
         * Xử lý toggle complete status
         * Frontend cần gửi: taskId
         */
        public function handleToggleComplete()
        {
            // TODO: Implement toggle complete
            $this->response['message'] = 'Chức năng đánh dấu hoàn thành đang được phát triển.';
            echo json_encode($this->response);
            exit();
        }
    }
