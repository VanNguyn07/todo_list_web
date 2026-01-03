<?php
header('Content-Type: application/json');
class HabitController
{
    public $response = ['success' => false, 'message' => ''];
    private $habitModel;

    public function __construct($database)
    {
        $this->habitModel =  new HabitModel($database);
    }

    public function handleInsertHabit() 
    {
        $name = trim($_POST['name'] ?? '');
        $period = trim($_POST['period'] ?? '');
        $target = trim($_POST['target'] ?? '');
        $unit = trim($_POST['unit'] ?? '');
        $iconKey = trim($_POST['iconKey'] ?? '');

        if (empty($name)) {
            $this->response['success'] = false;
            $this->response['message'] = "Please enter a habit name!";
            echo json_encode($this->response);
            exit();
        }

        if (empty($target)) {
            $this->response['success'] = false;
            $this->response['message'] = "Please set up your target!";
            echo json_encode($this->response);
            exit();
        }
        if (empty($unit)) {
            $this->response['success'] = false;
            $this->response['message'] = "Please enter a unit for your Habit!";
            echo json_encode($this->response);
            exit();
        }

        $isSuccess = $this->habitModel->insertHabit($name, $period, $target, $unit, $iconKey);

        if ($isSuccess) {
            $this->response['success'] = true;
            $this->response['message'] = "Add your habit is successfully";
        } else {
            $this->response['success'] = false;
            $this->response['message'] = "Error database " . $isSuccess['message'];
        }

        echo json_encode($this->response);
        exit();
    }

    public function handleDeleteHabit($id)
    {
        $result = $this->habitModel->deleteHabit($id);
        if ($result['success']) {
            $this->response['success'] = true;
            $this->response['message'] = 'Xóa habit thành công!';
        } else {
            $this->response['message'] = 'Lỗi CSDL: ' . $result['message'];
        }
        echo json_encode($this->response);
        exit();
    }

    public function handleUpdateHabit($id)
    {
        $name = trim($_POST['name'] ?? '');
        $period = trim($_POST['period'] ?? '');
        $target = trim($_POST['target'] ?? '');
        $unit = trim($_POST['unit'] ?? '');
        $iconKey = trim($_POST['iconKey'] ?? '');

        $result = $this->habitModel->updateHabit($id, $name, $period, $target, $unit, $iconKey);

        if ($result['success']) {
            $this->response['success'] = true;
            $this->response['message'] = "Update your habit successfully!";
        } else {
            $this->response['success'] = false;
            $errMsg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown DB error';
            $this->response['message'] = 'Lỗi DB: ' . $errMsg;
        }

        echo json_encode($this->response);
        exit();
    }

    public function handleGetAllHabit()
    {
        $habitForm = $this->habitModel->getAllHabit();
        if ($habitForm !== null && isset($habitForm['data'])) {
            $this->response['success'] = true;
            $this->response['habitForm'] = $habitForm['data'];
        } else {
            $this->response['message'] = "Lỗi khi lấy habit data";
            $this->response['habitForm'] = [];
        }
        echo json_encode($this->response);
        exit();
    }

    public function handleToggleStatus($id)
    {
        $current = $_POST['current'] ?? "";
        $completed = $_POST['completed'] ?? "";

        // Dùng isset để kiểm tra biến có được gửi lên không
        if (!isset($_POST['current']) || $_POST['current'] === '') {
            $this->response['success'] = false;
            $this->response['message'] = "Missing current value";
            echo json_encode($this->response);
            exit();
        }

        if (empty($completed)) {
            $this->response['success'] = false;
            $this->response['message'] = "Don't recieve completed";
        }


        $result = $this->habitModel->updateStatus($id, $current, $completed);
        if (is_array($result) && isset($result['success']) && $result['success'] === true) {
            $this->response['success'] = true;
            $this->response['message'] = "Status updated successfully!";
        } else {
            $this->response['success'] = false;
            $errMsg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown DB error';
            $this->response['message'] = 'Lỗi DB: ' . $errMsg;
        }
        echo json_encode($this->response);
        exit();
    }
}
