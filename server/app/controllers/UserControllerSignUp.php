<?php
header('Content-Type: application/json');

class UserControllerSignUp
{
    private $userModel;

    // Constructor nhận kết nối Database
    public function __construct($pdo)
    {
        $this->userModel = new UserModelSignUp($pdo);
    }

    // Hàm xử lý đăng ký
    public function register()
    {
        $response = ['success' => false, 'message' => ''];

        // Chỉ nhận POST request
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            $response['message'] = 'Invalid Request Method';
            return $response;
        }

        // Lấy dữ liệu an toàn (dùng ?? '' để tránh lỗi nếu thiếu dữ liệu)
        $username = trim($_POST['inputUserName'] ?? '');
        $password = trim($_POST['inputPassword'] ?? '');
        $gender   = trim($_POST['gender'] ?? '');
        $role   = trim($_POST['role'] ?? '');
        $email    = trim($_POST['inputEmail'] ?? '');

        // 1. Validation: Kiểm tra rỗng
        if (empty($username) || empty($password) || empty($email) || empty($role)) {
            $response['message'] = 'Please enter full field!';
            return $response;
        }

        // 2. Gọi Model kiểm tra trùng lặp
        $checkResult = $this->userModel->checkUserAndEmailExists($username, $email);

        if ($checkResult === "ERR_USERNAME_EXISTS") {
            // Lỗi: Trùng Username
            $response['success'] = false;
            $response['message'] = "Username already exists!";
            $response['field'] = 'username';
        } else if ($checkResult === "ERR_EMAIL_EXISTS") {
            // Lỗi: Trùng Email
            $response['success'] = false;
            $response['message'] = "Your email already exists!";
            $response['field'] = 'email';
        } else if ($checkResult === "NOT_FOUND") {
            // 3. Không trùng -> Tiến hành tạo tài khoản

            // Băm mật khẩu
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Gọi model insert
            $isSuccess = $this->userModel->insertDataIntoDatabase($username, $hashed_password, $gender, $role, $email);

            if ($isSuccess) {
                $response['success'] = true;
                $response['message'] = 'Create your account successfully!';
                // Thay vì trả về đường dẫn file, nên trả về route (đường dẫn ảo) của React
                $response['redirectUrl'] = '/sign-in';
            } else {
                $response['message'] = 'Failed to insert data.';
            }
        }

        return $response;
    }
}
