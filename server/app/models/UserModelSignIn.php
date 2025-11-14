<?php
include_once("../../config/connectDatabase.php");

class UserModelSignIn
{
    private $connect;
    private $table_name = "accounts_user";

    public $id;
    public $username;
    public $password;

    public function __construct($database)
    {
        $this->connect = $database;
    }

    // LIMIT = 1 vì username là unique nên khi tìm thấy thì lấy luôn không truy vấn hết bảng
    public function findByUserName($username)
    {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE username = ? LIMIT 1";
        $statement = mysqli_prepare($this->connect, $sql);

        if ($statement) {
            // Gắn username vào placeholder
            mysqli_stmt_bind_param($statement, "s", $username);

            $excute = mysqli_stmt_execute($statement);
            // Thực thi
            if ($excute) {
                // Lấy kết quả
                $result = mysqli_stmt_get_result($statement);
                // Fetch dữ liệu thành một mảng
                $dataArray = mysqli_fetch_assoc($result);
                // Đóng statement
                mysqli_stmt_close($statement);

                return $dataArray; // Trả về mảng user hoặc false nếu không có dòng nào
            }
        }
        return null; // Trả về null nếu có lỗi
    }
}
