<?php 
session_start(); // Luôn ở đầu

// ---- BẮT ĐẦU SỬA ----

// 1. Nạp Composer (RẤT QUAN TRỌNG, THÊM DÒNG NÀY)
require_once '../../../../vendor/autoload.php'; 

// 2. Nạp CSDL (Cần cho $pdo)
require_once '../../../../server/config/connectDatabaseForResetPass.php';

// 3. Nạp Model (Định nghĩa class UserForgotPassword)
require_once '../../../../server/app/models/forgotPasswordModel.php';

// 4. Nạp Helper (Định nghĩa hàm send_otp_from_email)
require_once '../../../../server/app/helpers/mail_helper.php';

// 5. Nạp Controller (Class này dùng Model và Helper ở trên)
require_once '../../../../server/app/controllers/PasswordResetController.php';

// ---- KẾT THÚC SỬA ----

// Bây giờ $pdo, Composer, và các class/hàm đã sẵn sàng
$controller = new PasswordResetController($pdo);

// Lấy 'action' từ POST
$action = $_POST['action'] ?? null;

// ... (Phần còn lại của file index.php giữ nguyên)
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    switch ($action){
            case 'send_otp':
                $controller->handleToRecevieOTP();
                break;
            
            case 'verification_code_otp':
                $controller->userEnrerOtp();
                break;
            
            case 'reset_password':
                $controller->handleResetPassword();
                break;

            default:
                // Hành động không xác định
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Hành động không hợp lệ.']);
                exit();
    }
}
?>