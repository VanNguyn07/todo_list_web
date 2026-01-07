<?php
header('Content-Type: application/json');

class UserControllerSignIn
{
    private $userModel;

    public function __construct($pdo)
    {
        $this->userModel = new UserModelSignIn($pdo);
    }

    public function login()
    {
        $response = [
            'success' => false,
            'message' => '',
            'field' => ''
        ];

        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            $response['message'] = 'Invalid Request Method';
            echo json_encode($response);
            exit();
        }

        $username = trim($_POST['inputUserName'] ?? '');
        $password = trim($_POST['inputPassword'] ?? '');
        $gender   = trim($_POST['gender'] ?? '');
        $role     = trim($_POST['role'] ?? "");

        if (empty($username) || empty($password) || empty($gender) || empty($role)) {
            $response['message'] = 'Please enter full field!';
            echo json_encode($response);
            exit();
        }

        // Tìm user
        $user = $this->userModel->findByUserName($username);

        // SỬA: Logic check user tồn tại chuẩn hơn
        if ($user === false) { 
            $response['message'] = 'Username does not exist!';
            $response['field'] = 'username';
        } else if (!password_verify($password, $user['password'])) {
            $response['message'] = 'Your password is incorrect!';
            $response['field'] = 'password';
        } else if ($user['gender'] !== $gender) {
            $response['message'] = 'Incorrect gender selection!';
            $response['field'] = 'gender';
        } else if ($user['role'] !== $role){
            $response['message'] = 'Incorrect role selection!';
            $response['field'] = 'role';
        } 
        else {
            // Đăng nhập thành công
            $this->userModel->updateLastLogin($user['id']);
            
            $response['success'] = true;
            $response['message'] = 'Login successfully';
            
            $response['id'] = $user['id'];
            $response['username'] = $user['username'];
            $response['role'] = $user['role'];
            $response['avatar'] = $user['avatar'] ?? null;
        }

        echo json_encode($response);
        exit();
    }

    public function handleGetAllUsers() {
        // Khởi tạo response trước để tránh lỗi undefined variable
        $response = ['success' => false, 'message' => '', 'result' => []];

        $result = $this->userModel->getAllUsers();

        if ($result['success'] === true) {
            $response['success'] = true;
            $response['message'] = 'Fetch all users successfully!';
            $response['result'] = $result['result']; // Chứa danh sách user
        } else {
            // Sửa lỗi chính tả $responsep thành $response
            $response['success'] = false;
            $response['message'] = "Lỗi khi lấy users data: " . ($result['message'] ?? '');
            $response['result'] = [];
        }

        echo json_encode($response);
        exit();
    }

    public function handleToggleStatus($id) {
        $status = $_POST['status'] ?? "";
        if (empty($status)) {
            $response['success'] = false;
            $response['message'] = "Don't recieve status";
        }

        $result = $this->userModel->toggleStatusUser($id, $status);
        if (is_array($result) && isset($result['success']) && $result['success'] === true) {
            $response['success'] = true;
            $response['message'] = "Status user updated successfully!";
        } else {
            $response['success'] = false;
            $errMsg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown DB error';
            $response['message'] = 'Lỗi DB: ' . $errMsg;
        }
        echo json_encode($response);
        exit();
    }
}