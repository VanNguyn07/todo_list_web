<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Xử lý riêng cho OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
session_start();
header('Content-Type: application/json'); // Luôn trả về JSON

try {
    // 1. NẠP FILE VÀ KHỞI TẠO
    $projectRoot = dirname(__DIR__, 2);
    
    // Nạp CSDL
    require_once $projectRoot . '/server/config/connectDatabaseOOP.php';
    
    // Nạp Model
    require_once $projectRoot . '/server/app/models/TaskModel.php'; 
    
    // Nạp Controller
    require_once $projectRoot . '/server/app/controllers/TaskController.php';
    
    // Biến $connect phải được tạo từ connectDatabase.php
    if (!isset($pdo)) {
         throw new Exception('Biến $pdo không tồn tại sau khi nạp CSDL.');
    }

    // Khởi tạo Controller
    $controller = new TaskController($pdo);

    // 2. LẤY DỮ LIỆU
    $action = $_GET['action'] ?? null;

    // 3. XỬ LÝ LOGIC
        switch ($action) {
            
            case 'get_nearest_tasks':
                $controller->handleSelectAllDataFromDb();
                break;

            case 'get_task_to_update':
                $controller->handleGetTasksToUpdate();

            default:
                echo json_encode(['success' => false, 'message' => 'Hành động không hợp lệ.']);
                exit();
        }
        echo json_encode(['success' => false, 'message' => 'Chỉ chấp nhận phương thức GET.']);
        exit();

} catch (Throwable $e) {
    // Bắt tất cả lỗi cú pháp
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi PHP Fatal Error: ' . $e->getMessage() . ' tại ' . $e->getFile() . ' dòng ' . $e->getLine()
    ]);
    exit();
}
?>