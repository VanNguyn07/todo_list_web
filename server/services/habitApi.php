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
    $projectRoot = dirname(__DIR__, 2);

    // Nạp CSDL
    require_once $projectRoot . '/server/config/connectDatabaseOOP.php';

    // Nạp Model
    require_once $projectRoot . '/server/app/models/HabitModel.php';

    // Nạp Controller
    require_once $projectRoot . '/server/app/controllers/HabitController.php';

    // Biến $connect phải được tạo từ connectDatabase.php
    if (!isset($pdo)) {
        throw new Exception('Biến $pdo không tồn tại sau khi nạp CSDL.');
    }

    $controller = new HabitController($pdo);

    // get data
    $action = $_POST['action'] ?? null;

    //handle logic
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch ($action) {
            case 'add_habit':
                $controller->handleInsertHabit();
                break;

            case 'is_completed' :
                $updateStatusById = $_POST['id'];
                $controller->handleToggleStatus($updateStatusById);
                break;

            case 'delete_habit':
                $deleteHabitById = $_POST['id'];
                $controller->handleDeleteHabit($deleteHabitById);
                break;

            case 'update_habit':
                $updateHabitById = $_POST['id'];
                $controller->handleUpdateHabit($updateHabitById);
                break;

            default:
                echo json_encode(['success' => false, 'message' => 'Hành động không hợp lệ.']);
                exit();
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Just only accept POST method']);
        exit();
    }
} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi PHP Fatal Error: ' . $e->getMessage() . ' tại ' . $e->getFile() . ' dòng ' . $e->getLine()
    ]);
    exit();
}
