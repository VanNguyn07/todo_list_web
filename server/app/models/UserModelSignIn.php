<?php
class UserModelSignIn
{
    private $pdo;
    private $table_name = "tasks";

    public function __construct($database) {
        $this->pdo = $database;
    }

    // LIMIT = 1 vì username là unique nên khi tìm thấy thì lấy luôn không truy vấn hết bảng
    public function findByUserName($username) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE username = ? LIMIT 1";

        try {
            $prepareStmt = $this->pdo->prepare($sql);

            $result = $prepareStmt->execute([$username]);
            if($result) {
                return ['success' => true];
            }else {
                return ['success' => false, 'message' => 'Can not add task'];
            }
        } catch (PDOException $e){
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
