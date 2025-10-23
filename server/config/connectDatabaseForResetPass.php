<?php 
// 1. Dùng new mysqli() (cách Object-Oriented) để khớp với Model của bạn
// 2. ĐẶT TÊN BIẾN LÀ $pdo để khớp với Router (index.php)

$pdo = new mysqli('localhost', 'root', '', 'sign_in');

// 3. Kiểm tra lỗi kết nối
if ($pdo->connect_error) {
    // Trả về JSON lỗi (để JS đọc được), thay vì làm crash
    header('Content-Type: application/json');
    die(json_encode([
        'success' => false, 
        'message' => 'Lỗi kết nối CSDL: ' . $pdo->connect_error
    ]));
}

// 4. Sửa lỗi thiếu dấu ;
$pdo->set_charset('utf8');

?>