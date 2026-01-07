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
header('Content-Type: application/json'); // Luôn trả về JSON

// 3. Thực thi
try {
    // 1. NẠP FILE VÀ KHỞI TẠO
    $projectRoot = dirname(__DIR__, 2);

    // Nạp CSDL
    require_once $projectRoot . '/server/config/connectDatabaseOOP.php';

    // Nạp Model
    require_once $projectRoot . '/server/app/models/UserModelSignIn.php';

    // Nạp Controller
    require_once $projectRoot . '/server/app/controllers/UserControllerSignIn.php';

    if (!isset($pdo)) {
        throw new Exception('Biến $pdo không tồn tại sau khi nạp CSDL.');
    }

    // Khởi tạo Controller với kết nối PDO
    $controller = new UserControllerSignIn($pdo);

    $action = $_POST['action'] ?? null;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch ($action) {
            case 'toggle_status':
                $userId = $_POST['userId'] ?? "";
                $controller->handleToggleStatus($userId);
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'Hành động không hợp lệ.']);
                exit();
        }
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server Error: ' . $e->getMessage()
    ]);
}

exit();
