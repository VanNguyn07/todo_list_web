<?php
// 1. Cấu hình CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Bật hiển thị lỗi PHP để debug (Tạm thời)
ini_set('display_errors', 0); // Tắt hiển thị ra HTML để tránh lỗi React
error_reporting(E_ALL);

try {
    session_start();

    $projectRoot = dirname(__DIR__, 2);

    // Định nghĩa đường dẫn các file cần nạp
    $files = [
        'DB' => $projectRoot . '/server/config/connectDatabaseOOP.php',
        'Model' => $projectRoot . '/server/app/models/UserModelSignIn.php',
        'Controller' => $projectRoot . '/server/app/controllers/UserControllerSignIn.php'
    ];

    // --- KIỂM TRA TỒN TẠI TRƯỚC KHI REQUIRE ---
    foreach ($files as $name => $path) {
        if (!file_exists($path)) {
            // Nếu không tìm thấy, ném lỗi ra ngay lập tức
            // Hàm realpath giúp bạn nhìn thấy đường dẫn thật mà PHP đang tìm
            throw new Exception("Lỗi không tìm thấy file $name! \nĐường dẫn đang tìm: " . $path);
        }
        require_once $path;
    }
    
    // 3. XỬ LÝ LOGIC
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        
        // Kiểm tra class có tồn tại không
        if (!class_exists('UserControllerSignIn')) {
            throw new Exception("File Controller đã nạp được, nhưng bên trong không có class 'UserControllerSignIn'. Hãy kiểm tra lại tên class trong file.");
        }

        $authController = new UserControllerSignIn($pdo);
        $result = $authController->login();
        echo json_encode($result);
    } else {
        echo json_encode(['success' => false, 'message' => 'Method GET OK. API Ready!']);
    }

} catch (Throwable $e) {
    // Dùng Throwable để bắt cả Fatal Error (Lỗi cú pháp, lỗi require)
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'file_error' => $e->getFile(), // File bị lỗi
        'line' => $e->getLine()       // Dòng bị lỗi
    ]);
}
exit();
?>