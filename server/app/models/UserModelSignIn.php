<?php
class UserModelSignIn
{
    private $pdo;
    private $table_name = "users";

    public function __construct($database) {
        $this->pdo = $database;
    }

    // LIMIT = 1 vì username là unique nên khi tìm thấy thì lấy luôn không truy vấn hết bảng
    public function findByUserName($username) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE username = ? LIMIT 1";

        try {
            $prepareStmt = $this->pdo->prepare($sql);

            $prepareStmt->execute([$username]);
            $user = $prepareStmt->fetch(PDO::FETCH_ASSOC);

            if($user) {
                return $user;
            }else {
                return ['success' => false, 'message' => 'Can not add task'];
            }
        } catch (PDOException $e){
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
