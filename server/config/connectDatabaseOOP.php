<?php
// Cấu hình database cho Laragon
$host = 'localhost';
$dbname = 'todolist_app';
$username = 'root';
$password = '';

// Header JSON để frontend (JS) hiểu phản hồi
if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

try {
    // 1. Khởi tạo kết nối PDO chuẩn (Thay vì mysqli)
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    // 2. Cài đặt chế độ báo lỗi (Exception)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 3. Cài đặt chế độ lấy dữ liệu mặc định (Mảng kết hợp)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Code chạy đến đây là ngon lành!

} catch (PDOException $e) {
    // Xử lý lỗi kết nối
    error_log("Lỗi kết nối Database: " . $e->getMessage());
    
    if (!headers_sent()) {
        http_response_code(500);
    }
    
    // Trả về JSON báo lỗi
    echo json_encode([
        'success' => false,
        'message' => 'Không thể kết nối CSDL: ' . $e->getMessage(),
        'error_type' => 'database_connection'
    ]);
    
    // Dừng chương trình
    exit();
}
?>