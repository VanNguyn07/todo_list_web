<?php

// 1. Cấu hình CORS & Headers
header("Access-Control-Allow-Origin: http://localhost:5173"); // Hoặc domain frontend của bạn
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Xử lý Preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Kết nối DB & Load Controller
session_start();

// 1. NẠP FILE VÀ KHỞI TẠO
$projectRoot = dirname(__DIR__, 2);

// Nạp CSDL
require_once $projectRoot . '/server/config/connectDatabaseOOP.php';

// Nạp Model
require_once $projectRoot . '/server/app/models/UserModelSignUp.php';

// Nạp Controller
require_once $projectRoot . '/server/app/controllers/UserControllerSignUp.php';

// 3. Thực thi
try {
    // Khởi tạo Controller với kết nối PDO
    $controller = new UserControllerSignUp($pdo);

    // Gọi hàm xử lý
    $result = $controller->register();

    // Trả kết quả về React
    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server Error: ' . $e->getMessage()
    ]);
}

exit();
