<?php 
// 1. Dùng new mysqli() (cách Object-Oriented) để khớp với Model của bạn
// 2. ĐẶT TÊN BIẾN LÀ $pdo để khớp với Router (index.php)

// Kiểm tra xem đã có header chưa để tránh lỗi "headers already sent"
if (!headers_sent()) {
    header('Content-Type: application/json');
}

// Thử kết nối database
try {
    $pdo = new mysqli('localhost', 'root', '', 'task_app_db');
    
    // Kiểm tra lỗi kết nối
    if ($pdo->connect_error) {
        // Log lỗi
        error_log("Database connection error: " . $pdo->connect_error);
        
        // Trả về JSON lỗi (để JS đọc được), thay vì làm crash
        if (!headers_sent()) {
            http_response_code(500);
        }
        die(json_encode([
            'success' => false, 
            'message' => 'Lỗi kết nối CSDL: ' . $pdo->connect_error . '. Vui lòng kiểm tra lại cấu hình database.',
            'error_type' => 'database_connection'
        ]));
    }
    
    // Set charset
    if (!$pdo->set_charset('utf8')) {
        error_log("Failed to set charset: " . $pdo->error);
        // Không die ở đây vì có thể vẫn dùng được, chỉ log
    }
    
} catch (Exception $e) {
    error_log("Exception in connectDatabaseForResetPass.php: " . $e->getMessage());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }
    die(json_encode([
        'success' => false,
        'message' => 'Lỗi khi khởi tạo kết nối database: ' . $e->getMessage(),
        'error_type' => 'database_init'
    ]));
} catch (Error $e) {
    error_log("Fatal error in connectDatabaseForResetPass.php: " . $e->getMessage());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }
    die(json_encode([
        'success' => false,
        'message' => 'Lỗi nghiêm trọng khi khởi tạo database: ' . $e->getMessage(),
        'error_type' => 'database_fatal'
    ]));
}

?>