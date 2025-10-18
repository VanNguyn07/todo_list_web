<?php 
class UserModelSignUp {
    private $connect;
    private $table_name = "users";

    public function __construct($database)
    {
        $this->connect = $database;
    }

    /**
     * Chèn người dùng mới vào database.
     * @param string $username Tên đăng nhập.
     * @param string $hashed_password Mật khẩu ĐÃ ĐƯỢC BĂM.
     * @return bool Trả về true nếu thành công, false nếu thất bại.
     */
    function insertDataIntoDatabase($username, $hashed_password, $gender) {
        // Câu lệnh SQL với placeholder (?)
        $sql = "INSERT INTO " . $this->table_name . " (username, password, gender) VALUES (?, ?, ?)";
        try {
            $prepareStmt = mysqli_prepare($this->connect, $sql);

            if ($prepareStmt) {
            // "ss" -> string, string
            mysqli_stmt_bind_param($prepareStmt, "sss", $username, $hashed_password, $gender);

            // Thực thi và trả về kết quả (true/false)
                if (mysqli_stmt_execute($prepareStmt)) {
                mysqli_stmt_close($prepareStmt);
                return true; // Thành công
                }
            }
        }catch(Exception $e){
            if ($this->connect->errno == 1062) {
                return false; // Trả về false nếu username đã tồn tại
            }
        }
    }
}
?>