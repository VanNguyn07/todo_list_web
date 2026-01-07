<?php
class UserModelSignIn
{
    private $pdo;
    private $table_name = "users";

    public function __construct($database)
    {
        $this->pdo = $database;
    }

    public function findByUserName($username)
    {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE username = ? LIMIT 1";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute([$username]);
            $user = $prepareStmt->fetch(PDO::FETCH_ASSOC);

            // Trả về false nếu không thấy, để Controller dễ check
            return $user ? $user : false;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function updateLastLogin($userId)
    {
        $sql = "UPDATE " . $this->table_name . " SET last_login = NOW() WHERE id = ?";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    // Lấy tất cả user để hiện lên Admin Panel
    public function getAllUsers()
    {

        $sql = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";

        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $prepareStmt->execute();
            $result = $prepareStmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'result' => $result];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function toggleStatusUser($id, $status)
    {
        if ($status !== 'active' && $status !== 'deactivated') {
        return ['success' => false, "message" => "Invalid status value"];
    }

        $sql = " UPDATE " . $this->table_name . " SET status = ? WHERE id = ?";
        try {
            $prepareStmt = $this->pdo->prepare($sql);
            $result = $prepareStmt->execute([$status, $id]);

            if ($result) {
                return ['success' => true, "message" => "Update status user is successfully!"];
            } else {
                return ['success' => false, "message" => "Update status user is not successfully!"];
            }
        } catch (PDOException $e) {
            error_log("SQL update status users Error: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
