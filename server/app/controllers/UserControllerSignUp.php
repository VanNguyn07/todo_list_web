<?php 
// Báo cho trình duyệt biết rằng đây là một phản hồi JSON
header('Content-Type: application/json');
session_start();
require_once "../../config/connectDatabase.php";
require_once "../models/UserModelSignUp.php";

$response = ['success' => false, 'message' =>''];

if($_SERVER['REQUEST_METHOD'] == "POST"){
    $userModelSignUp = new UserModelSignUp($connect);

    // Dùng ?? '' để tránh lỗi nếu không có dữ liệu
    $username = trim($_POST['inputUserName']);
    $password = trim($_POST['inputPassword']);

    // --- BẮT BUỘC: Thêm validation phía server ---
    if(empty($username) || empty($password)){
        $response['message'] = 'Please enter full field!';
    } else {
        // --- BẢO MẬT: Băm mật khẩu trước khi lưu ---
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Gọi Model để chèn dữ liệu và LẤY KẾT QUẢ trả về
        $isSuccess = $userModelSignUp->insertDataIntoDatabase($username, $hashed_password);
        
        // --- LOGIC: Kiểm tra kết quả từ Model ---
        if ($isSuccess) {
            $response['success'] = true; // BÁO CHO JAVASCRIPT BIẾT LÀ ĐÃ THÀNH CÔNG
            $response['message'] = 'Create your account successfully!';
            // Đường dẫn đến trang đăng nhập
            $response['redirectUrl'] = '/todolist/todo_list_web/client/src/pages/signInPages/SignIn.html';
        } else {
            $response['success'] = false;
            $response['message'] = 'username already exists!';
        }
    }
} else {
    $response['message'] = 'Yêu cầu không hợp lệ.';
}

// Luôn luôn echo ra mảng response đã được encode
echo json_encode($response);
exit();
?>