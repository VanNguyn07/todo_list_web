<?php

class UserForgotPasswordModel
{
    private $pdo; // Đổi tên biến thành $pdo cho chuẩn
    private $table_name = "users"; // Tên bảng của bạn (lúc trước là accounts_user, giờ là users)

    // Constructor nhận kết nối PDO
    public function __construct($database)
    {
        $this->pdo = $database;
    }

    // 1. Tìm người dùng bằng email
    public function findUserByEmail($email)
    {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE email = ? LIMIT 1";

        try {
            $stmt = $this->pdo->prepare($sql);
            // Trong PDO, truyền thẳng biến vào execute, không cần bind_param "s"
            $stmt->execute([$email]);
            
            // Lấy 1 dòng dữ liệu dạng mảng kết hợp (Associative Array)
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Nếu có user thì trả về, không thì trả về null
            return $user ? $user : null;

        } catch (PDOException $e) {
            // Ghi log lỗi nếu cần thiết: error_log($e->getMessage());
            return null;
        }
    }

    // 2. Lưu mã OTP và thời gian hết hạn
    public function saveOTPCodeIntoDB($email, $otp_code, $otp_expires)
    {
        $sql = "UPDATE " . $this->table_name . " SET otp_code = ?, otp_expires = ? WHERE email = ?";

        try {
            $stmt = $this->pdo->prepare($sql);
            // Thứ tự trong mảng phải khớp với thứ tự dấu ? trong câu SQL
            return $stmt->execute([$otp_code, $otp_expires, $email]);

        } catch (PDOException $e) {
            return false;
        }
    }

    // 3. Xác thực OTP (Kiểm tra đúng mã và còn hạn)
    public function validateOTP($email, $otp)
    {
        // Thiết lập múi giờ Việt Nam để so sánh cho chính xác
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        $currentTime = date('Y-m-d H:i:s');

        // Câu lệnh logic: Email đúng + OTP đúng + Thời gian hết hạn phải LỚN HƠN hiện tại
        $sql = "SELECT * FROM " . $this->table_name . " 
                WHERE email = ? 
                AND otp_code = ? 
                AND otp_expires > ?";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$email, $otp, $currentTime]);
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Trả về dữ liệu user nếu đúng, false nếu sai
            return $user ? $user : false;

        } catch (PDOException $e) {
            return false;
        }
    }

    // 4. Xóa OTP sau khi đã sử dụng (Để không dùng lại được nữa)
    public function clearOtpAfterUsed($email)
    {
        $sql = "UPDATE " . $this->table_name . " SET otp_code = NULL, otp_expires = NULL WHERE email = ?";

        try {
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute([$email]);
        } catch (PDOException $e) {
            return false;
        }
    }

    // 5. Cập nhật mật khẩu mới
    public function updateNewPassword($email, $newPassword)
    {
        $sql = "UPDATE " . $this->table_name . " SET password = ? WHERE email = ?";

        try {
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute([$newPassword, $email]);
        } catch (PDOException $e) {
            return false;
        }
    }
}
?>