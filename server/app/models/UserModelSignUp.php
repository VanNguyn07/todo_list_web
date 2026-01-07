<?php
class UserModelSignUp
{
    private $pdo;
    private $table_name = "users";

    public function __construct($database)
    {
        $this->pdo = $database;
    }

    function checkUserAndEmailExists($username, $email)
    {
        $sql = "SELECT username, email FROM " . $this->table_name . " WHERE username = ? OR email = ? LIMIT 1";
        
        try {
            $prepareStmt = $this->pdo->prepare($sql);

            $prepareStmt->execute([$username, $email]);
            
            // Lấy 1 dòng dữ liệu duy nhất (vì LIMIT 1)
            $existingUser = $prepareStmt->fetch(PDO::FETCH_ASSOC);
            // PDO::FETCH_ASSOC nghĩa là chỉ lấy key theo tên cột, không lấy số thứ tự

            if($existingUser){
                if($existingUser['username'] === $username){
                    return "ERR_USERNAME_EXISTS";
                }
                if ($existingUser['email'] === $email) {
                    return "ERR_EMAIL_EXISTS"; // Báo lỗi trùng email
                }
            }
            return "NOT_FOUND";
        } catch (PDOException $e){
            return "ERROR_DB";
        }
    }


    function insertDataIntoDatabase($username, $hashed_password, $gender, $role, $email)
    {
        $sql = "INSERT INTO " . $this->table_name . " (username, password, gender, role, email) VALUES (?, ?, ?, ?, ?)";

        try {
            $prepareStmt = $this->pdo->prepare($sql);

            $result = $prepareStmt->execute([$username, $hashed_password, $gender, $role, $email]);

            if($result){
                return ['success' => true];
            }else {
                return ['success' => false, 'message' => 'Can not add into database'];
            }
        }catch(PDOException $e){
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }  
}
