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
    $gender = trim($_POST['gender']);
    $email = trim($_POST['inputEmail']);

    // --- BẮT BUỘC: Thêm validation phía server ---
    if(empty($username) || empty($password) || empty($email)){
        $response['message'] = 'Please enter full field!';
    } else {
        // $checkResult bây giờ là một CHUỖI (ví dụ: "ERR_USERNAME_EXISTS")
        $checkResult = $userModelSignUp->checkUserAndEmailExists($username, $email);
        
        // --- LOGIC: Kiểm tra kết quả từ Model ---
        if($checkResult === "ERR_USERNAME_EXISTS"){
            // Lỗi: Trùng Username
            $response['success'] = false;
            $response['message'] = "Username already exists!";
            $response['field'] = 'username';
        } else if($checkResult === "ERR_EMAIL_EXISTS"){
            // Lỗi: Trùng Email
            $response['success'] = false;
            $response['message'] = "Your email already exists!";
            $response['field'] = 'email';
        } else if($checkResult === "NOT_FOUND"){
            //Không trùng, TIẾN HÀNH INSERT
        // --- BẢO MẬT: Băm mật khẩu trước khi lưu ---
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $isSuccess = $userModelSignUp->insertDataIntoDatabase($username, $hashed_password, $gender, $email);

            if($isSuccess){
                $response['success'] = true;
                $response['message'] = 'Create your account successfully!';
                $response['redirectUrl'] = '/todolist/todo_list_web/client/src/pages/signInPages/SignIn.html';
            }
        }
    }
} else {
    $response['message'] = 'Yêu cầu không hợp lệ.';
}

// Luôn luôn echo ra mảng response đã được encode
echo json_encode($response);
exit();
?>