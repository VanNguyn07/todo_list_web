<?php
error_reporting(0); 
ini_set('display_errors', 0);
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
    require_once $projectRoot . '/server/app/models/QuickNoteModel.php';

    // Nạp Controller
    require_once $projectRoot . '/server/app/controllers/QuickNoteController.php';

    // Biến $connect phải được tạo từ connectDatabase.php
    if (!isset($pdo)) {
        throw new Exception('Biến $pdo không tồn tại sau khi nạp CSDL.');
    }

    // Khởi tạo Controller
    $controller = new QuickNoteController($pdo);

    // 2. LẤY DỮ LIỆU
    $action = $_POST['action'] ?? null;

    // 3. XỬ LÝ LOGIC
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch ($action) {

            case 'save_quick_notes':
                $controller->handleSaveNotes();
                break;
            
            case 'get_quick_notes':
                $controller->hanldeGetNotes();
                break;

            default:
                echo json_encode(['success' => false, 'message' => 'Hành động không hợp lệ.']);
                exit();
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Chỉ chấp nhận phương thức POST.']);
        exit();
    }
} catch (Throwable $e) {
    // Bắt tất cả lỗi cú pháp
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi PHP Fatal Error: ' . $e->getMessage() . ' tại ' . $e->getFile() . ' dòng ' . $e->getLine()
    ]);
    exit();
}
