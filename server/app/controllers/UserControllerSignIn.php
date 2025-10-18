<?php 
// Báo cho trình duyệt biết rằng đây là một phản hồi JSON
header('Content-Type: application/json');
session_start();

require_once "../../config/connectDatabase.php";
require_once "../models/UserModelSignIn.php";

$response = ['success' => false, 'message' =>''];

if($_SERVER['REQUEST_METHOD'] == "POST"){
    // Khởi tạo đối tượng User và truyền kết nối DB vào
    $userModelSignIn = new UserModelSignIn($connect);

    $username = trim($_POST['inputUserName']);
    $password = trim($_POST['inputPassword']);
    $gender = trim($_POST['gender']);

    if(empty($username) || empty($password) || empty($gender)){
        $response['message'] = 'Please enter full field!';
    }else {
        // Gọi Model để tìm user
        $user = $userModelSignIn->findByUserName($username);
        
        if(!$user){
            // Lỗi 1: Không tìm thấy user
            $response['message'] = 'Username does not exist!';
            $response['field'] = 'username';
        } else if(!password_verify($password, $user['password'])) {
            // Lỗi 2: User có, nhưng sai mật khẩu
            $response['message'] = 'Your passwors incorrect!';
            $response['field'] = 'password';
        } else if($user['gender'] !== $gender){
            $response['message'] = 'Incorrect gender selection!';
            $response['field'] = 'gender';
        } else {
            // KHÔNG LỖI: Tất cả đều đúng -> Đăng nhập thành công
            $response['success'] = true;
            $response['redirectUrl'] = 'https://vocabenglish.id.vn/';
            
            $_SESSION["loggedin"] = true;
            $_SESSION["id"] = $user['id'];
            $_SESSION["username"] = $user['username'];
        }
    }
} else {
    $response['message'] = 'Yêu cầu không hợp lệ.';
}

// In ra chuỗi JSON và kết thúc script.
// JavaScript sẽ nhận được chuỗi này.
echo json_encode($response);
exit();

?>