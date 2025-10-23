<?php 

class UserForgotPassword {
    private $connect; // Đây là đối tượng mysqli
    private $table_name = "accounts_user";

    public function __construct($database) {
        $this->connect = $database;
    }

    //Tìm người dùng bằng email
    public function findUserByEmail($email){
        // Sửa: Dùng $this->connect->prepare
        $stmt = $this->connect->prepare("SELECT * FROM " . $this->table_name . " WHERE email = ?");
        $stmt->bind_param("s", $email); // "s" là string
        $stmt->execute();
        $result = $stmt->get_result();
        $dataArray = $result->fetch_assoc();
        $stmt->close();
        
        return $dataArray ? $dataArray : null; // Trả về null nếu không tìm thấy
    }

    //Lưu mã OTP và thời gian hết hạn vào CSDL
    public function saveOTPCodeIntoDB($email, $otp_code, $otp_expires){
        // Sửa: Dùng $this->connect->prepare
        $stmt = $this->connect->prepare("UPDATE " . $this->table_name . " SET otp_code = ?, otp_expires = ? WHERE email = ?");
        $stmt->bind_param("sss", $otp_code, $otp_expires, $email); // "sss"
        $executeSuccess = $stmt->execute();
        $stmt->close();

        return $executeSuccess;
    }

    //Xác thực OTP
    public function validateOTP($email, $otp){
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        $currentTime = date('Y-m-d H:i:s');

        // Sửa: Dùng $this->connect->prepare
        $stmt = $this->connect->prepare("SELECT * FROM " . $this->table_name . " WHERE email = ? AND otp_code = ? AND otp_expires > ?");
        
        // Sửa: Phải là "sss" vì có 3 biến (email, otp, currentTime)
        $stmt->bind_param("sss", $email, $otp, $currentTime); 
        
        $stmt->execute();
        $result = $stmt->get_result();
        $dataArray = $result->fetch_assoc();
        $stmt->close();
        
        return $dataArray ? $dataArray : false;
    }

    //Hàm này đã đúng
    public function clearOtpAfterUsed($email){
        $stmt = $this->connect->prepare("UPDATE " . $this->table_name . " SET otp_code = NULL, otp_expires = NULL WHERE email = ?");
        $stmt->bind_param("s", $email);
        return $stmt->execute();
    }

    //Hàm này đã đúng
    public function updateNewPassword($email, $newPassword){
        $stmt = $this->connect->prepare("UPDATE " . $this->table_name . " SET password = ? WHERE email = ? ");
        $stmt->bind_param("ss", $newPassword, $email);
        return $stmt->execute();
    }
}
?>