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

    if(empty($username) || empty($password)){
        $response['message'] = 'Please enter full field!';
    }else {
        // Gọi Model để tìm user
        $user = $userModelSignIn->findByUserName($username);
        
        if($user && password_verify($password, $user['password'])){
            // Đăng nhập thành công
            $_SESSION["loggedin"] = true;
            $_SESSION["id"] = $user['id'];
            $_SESSION["username"] = $user['username'];

            $response['success'] = true;// Báo thành công
            $response['redirectUrl'] = 'https://vocabenglish.id.vn/';
        }else {
        $response['message'] = 'Username or Password incorrect!';
        
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