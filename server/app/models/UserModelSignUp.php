<?php
class UserModelSignUp
{
    private $connect;
    private $table_name = "accounts_user";

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
    // UserModelSignUp.php

    function checkUserAndEmailExists($username, $email)
    {
        $sql = "SELECT username, email FROM " . $this->table_name . " WHERE username = ? OR email = ? LIMIT 1";
        $prepareStmt = mysqli_prepare($this->connect, $sql);

        if ($prepareStmt) {
            mysqli_stmt_bind_param($prepareStmt, "ss", $username, $email);
            mysqli_stmt_execute($prepareStmt);

            $result = mysqli_stmt_get_result($prepareStmt);
            $dataArray = mysqli_fetch_assoc($result);
            mysqli_stmt_close($prepareStmt);

            if ($dataArray) {
                // Nếu tìm thấy
                if ($dataArray['username'] === $username) {
                    return "ERR_USERNAME_EXISTS"; // Báo lỗi trùng username
                }
                if ($dataArray['email'] === $email) {
                    return "ERR_EMAIL_EXISTS"; // Báo lỗi trùng email
                }
            }
            return "NOT_FOUND";
        }
        // Lỗi prepare
        return "ERR_GENERAL";
    }


    function insertDataIntoDatabase($username, $hashed_password, $gender, $email)
    {
        $sql = "INSERT INTO " . $this->table_name . " (username, password, gender, email) VALUES (?, ?, ?, ?)";
        $prepareStmt = mysqli_prepare($this->connect, $sql);

        if ($prepareStmt) {
            mysqli_stmt_bind_param($prepareStmt, "ssss", $username, $hashed_password, $gender, $email);

            // 1. Thực thi
            if (mysqli_stmt_execute($prepareStmt)) {
                mysqli_stmt_close($prepareStmt);
                return true;
            }
        }
        return false; // Lỗi câu lệnh
    }
}
