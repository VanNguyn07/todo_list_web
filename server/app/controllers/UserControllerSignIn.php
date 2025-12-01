<?php
header('Content-Type: application/json');
class UserControllerSignIn
{
    private $userModel;
    // Constructor nhận kết nối Database
    public function __construct($pdo)
    {
        $this->userModel = new UserModelSignIn($pdo);
    }

    // Hàm chính để xử lý đăng nhập
    public function login()
    {
        $response = [
            'success' => false,
            'message' => '',
            'field' => '' // Thêm field để React biết lỗi ở input nào
        ];
        // Chỉ xử lý khi là POST request
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            $response['message'] = 'Invalid Request Method';
            echo json_encode($response);
            exit();
        }

        // Lấy dữ liệu từ POST (Dùng toán tử null coalescing ?? để tránh lỗi undefined index)
        $username = trim($_POST['inputUserName'] ?? '');
        $password = trim($_POST['inputPassword'] ?? '');
        $gender   = trim($_POST['gender'] ?? '');

        // 1. Validate dữ liệu rỗng
        if (empty($username) || empty($password) || empty($gender)) {
            $response['message'] = 'Please enter full field!';
            echo json_encode($response);
            exit();
        }

        // 2. Tìm user trong database
        $user = $this->userModel->findByUserName($username);

        if (!$user) {
            // Lỗi: Không tìm thấy username
            $response['message'] = 'Username does not exist!';
            $response['field'] = 'username';
        } else if (!password_verify($password, $user['password'])) {
            // Lỗi: Sai mật khẩu
            $response['message'] = 'Your password is incorrect!';
            $response['field'] = 'password';
        } else if ($user['gender'] !== $gender) {
            // Lỗi: Sai giới tính (Logic riêng của bạn)
            $response['message'] = 'Incorrect gender selection!';
            $response['field'] = 'gender';
        } else {
            // --- ĐĂNG NHẬP THÀNH CÔNG ---

            $response['success'] = true;
            $response['message'] = 'Login successfully';
            $response['id'] = $user['id'];
            $response['username'] = $user['username'];

            // // Lưu session
            // $_SESSION["loggedin"] = true;
            // $_SESSION["id"] = $user['id'];
            // $_SESSION["username"] = $user['username'];

            // $response['success'] = true;
            // // Đường dẫn redirect này React sẽ dùng để navigate
            // $response['redirectUrl'] = '../../../client/src/pages/dashboard/Dashboard.jsx';
            // $response['message'] = 'Login successfully!';
        }

        echo json_encode($response);
        exit();
    }
}
