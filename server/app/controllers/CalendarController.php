<?php
header('Content-Type: application/json');
class CalendarController
{
    public $response = ['success' => false, 'message' => ""];
    private $calendarModel;

    public function __construct($database)
    {
        $this->calendarModel = new CalendarModel($database);
    }

    public function handleInsertEvent()
    {
        $name = trim($_POST['name'] ?? "");
        $startTime = trim($_POST['startTime'] ?? "");
        $endTime = trim($_POST['endTime'] ?? "");
        $description = trim($_POST['description'] ?? "");
        $date = trim($_POST['date'] ?? "");
        $color = trim($_POST['color'] ?? "");

        if (empty($name)) {
            $this->response['success'] = false;
            $this->response['message'] = "Please enter a habit name!";
            echo json_encode($this->response);
            exit();
        }

        if (empty($startTime) || empty($endTime)) {
            $this->response['success'] = false;
            $this->response['message'] = "Please set up timer for your event!";
            echo json_encode($this->response);
            exit();
        }

        $isSuccess = $this->calendarModel->insertEvent($name, $startTime, $endTime, $description, $date, $color);
        if ($isSuccess) {
            $this->response['success'] = true;
            $this->response['message'] = "Add your event is successfully";
        } else {
            $this->response['success'] = false;
            $this->response['message'] = "Error database " . $isSuccess['message'];
        }

        echo json_encode($this->response);
        exit();
    }

    public function handleDeleteEvent($id)
    {
        $result = $this->calendarModel->deleteEvent($id);
        if ($result['success']) {
            $this->response['success'] = true;
            $this->response['message'] = 'Xóa event thành công!';
        } else {
            $this->response['message'] = 'Lỗi CSDL: ' . $result['message'];
        }
        echo json_encode($this->response);
        exit();
    }

        public function handleUpdateHabit($id)
    {
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $startTime = trim($_POST['startTime'] ?? '');
        $endTime = trim($_POST['endTime'] ?? '');

        $result = $this->calendarModel->updateEvent($id, $name, $description, $startTime, $endTime);

        if ($result['success']) {
            $this->response['success'] = true;
            $this->response['message'] = "Update your event successfully!";
        } else {
            $this->response['success'] = false;
            $errMsg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown DB error';
            $this->response['message'] = 'Lỗi DB: ' . $errMsg;
        }

        echo json_encode($this->response);
        exit();
    }


    public function handleGetAllEvent()
    {
        $eventForm = $this->calendarModel->getAllEvent();
        if ($eventForm !== null && isset($eventForm['data'])) {
            $this->response['success'] = true;
            $this->response['eventForm'] = $eventForm['data'];
        } else {
            $this->response['message'] = "Lỗi khi lấy event data";
            $this->response['eventForm'] = [];
        }
        echo json_encode($this->response);
        exit();
    }

    public function handleUpdateStatusEvent()
    {
        $id = $_POST['id'] ?? "";
        $completed = $_POST['completed'] ?? "";

        $result = $this->calendarModel->updateStatusEvent($id, $completed);
        if ($result['success']) {
            $this->response['success'] = true;
            $this->response['message'] = "Status event updated successfully!";
        } else {
            $this->response['success'] = false;
            $errMsg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown DB error';
            $this->response['message'] = 'Lỗi DB: ' . $errMsg;
        }
        echo json_encode($this->response);
        exit();
    }
}
