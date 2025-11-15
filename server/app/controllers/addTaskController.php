    <?php
    header('Content-Type: application/json');
    class AddTaskController {
        // create a Associative Array hay là mảng kết hợp lưu theo Key => Value
        public $response = ['success' => false, 'message' => ''];
        private $addTaskModel;

        // hàm constructor sẽ được tự động gọi khi use new 
        public function __construct($database) {
            $this->addTaskModel = new AddTaskModel($database);
        }

        public function handleInsertTaskIntoDb(){
            // Lấy dữ liệu từ POST
            $titleTask = trim($_POST['titleTask'] ?? '');
            $detailTask = trim($_POST['detailTask'] ?? '');
            $categoryTask = trim($_POST['categoryTask'] ?? '');
            $priorityTask = trim($_POST['priorityTask'] ?? '');

            // Validation
            if(empty($titleTask)){
                $this->response['message'] = 'Vui lòng nhập tiêu đề task!';
                $this->response['field'] = 'titleTask';
                echo json_encode($this->response);
                exit();
            }

            if(empty($detailTask)){
                $this->response['message'] = 'Vui lòng nhập chi tiết task!';
                $this->response['field'] = 'detailTask';
                echo json_encode($this->response);
                exit();
            }

            if(empty($categoryTask)){
                $this->response['message'] = 'Vui lòng chọn danh mục!';
                $this->response['field'] = 'categoryTask';
                echo json_encode($this->response);
                exit();
            }

            if(empty($priorityTask)){
                $this->response['message'] = 'Vui lòng chọn độ ưu tiên!';
                $this->response['field'] = 'priorityTask';
                echo json_encode($this->response);
                exit();
            }

            // Validate category
            $validCategories = ['work', 'personal', 'study'];
            if(!in_array($categoryTask, $validCategories)){
                $this->response['message'] = 'Danh mục không hợp lệ!';
                echo json_encode($this->response);
                exit();
            }

            // Validate priority
            $validPriorities = ['1', '2', '3'];
            if(!in_array($priorityTask, $validPriorities)){
                $this->response['message'] = 'Độ ưu tiên không hợp lệ!';
                echo json_encode($this->response);
                exit();
            }

            // Gọi Model để insert vào database
            $isSuccess = $this->addTaskModel->insertTaskIntoDatabase(
                $titleTask, 
                $detailTask, 
                $categoryTask, 
                $priorityTask
            );

            if($isSuccess){
                $this->response['success'] = true;
                $this->response['message'] = 'Thêm task thành công!';
            } else {
                $this->response['message'] = 'Lỗi CSDL: ' . $isSuccess['message'];
            }

            echo json_encode($this->response);
            exit();
        }

        /**
         * Xử lý cập nhật task
         * Frontend cần gửi: taskId, titleTask, detailTask, categoryTask, priorityTask
         */
        public function handleUpdateTask(){
            // TODO: Implement update task
            $this->response['message'] = 'Chức năng cập nhật task đang được phát triển.';
            echo json_encode($this->response);
            exit();
        }

        /**
         * Xử lý xóa task
         * Frontend cần gửi: taskId
         */
        public function handleDeleteTask(){
            // TODO: Implement delete task
            $this->response['message'] = 'Chức năng xóa task đang được phát triển.';
            echo json_encode($this->response);
            exit();
        }

        /**
         * Xử lý lấy danh sách tasks
         * Frontend có thể gửi: category, priority để filter
         */
        public function handleGetTasks(){
            // TODO: Implement get tasks
            $this->response['message'] = 'Chức năng lấy danh sách task đang được phát triển.';
            echo json_encode($this->response);
            exit();
        }

        /**
         * Xử lý toggle complete status
         * Frontend cần gửi: taskId
         */
        public function handleToggleComplete(){
            // TODO: Implement toggle complete
            $this->response['message'] = 'Chức năng đánh dấu hoàn thành đang được phát triển.';
            echo json_encode($this->response);
            exit();
        }
    }
