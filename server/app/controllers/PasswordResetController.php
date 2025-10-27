<?php 
// 1. Xóa session_start() và các require ở đây.
// Chúng ta chỉ giữ lại header()
header('Content-Type: application/json');

class PasswordResetController {
    public $response = ['success' => false, 'message' => ''];
    private $userModelResetPass;

    public function __construct($database) {
        $this->userModelResetPass = new UserForgotPassword($database);
    }

    public function handleToRecevieOTP(){
        $email_receiver = $_POST['email'] ?? '';

        if(empty($email_receiver)){
            $this->response['message'] = 'Please enter your email!.';
            // Sửa: Phải echo trước khi exit
            echo json_encode($this->response);
            exit();
        }

        $findUserByEmail = $this->userModelResetPass->findUserByEmail($email_receiver);
        if($findUserByEmail){
            $otp_code = rand(100000, 999999);
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $otp_expires = date('Y-m-d H:i:s', strtotime('+5 minutes'));
            
            $saved = $this->userModelResetPass->saveOTPCodeIntoDB($email_receiver, $otp_code, $otp_expires);

            if(!$saved){
                $this->response['message'] = 'Lỗi hệ thống: Không thể lưu mã OTP. Vui lòng thử lại.';
                // Sửa: Phải echo trước khi exit
                echo json_encode($this->response);
                exit();
            }
            
            try {
                send_otp_from_email($email_receiver, $otp_code);
                $_SESSION['reset_email'] = $email_receiver;

                $this->response['success'] = true;
                $this->response['message'] = 'OTP code has been sent successfully. Please check your email!';
                $this->response['redirectUrl'] = '/todoList/todo_list_web/client/src/pages/forgotPassword/ValidatePassword.html';

            }catch (Exception $e){
                $this->response['message'] = 'Lỗi khi gửi email. Vui lòng thử lại sau.';
            }
        } else {
            $this->response['success'] = false;
            $this->response['message'] = 'If your email exist in system, a OTP code has been sent!';
        }
        
        // Sửa: Thêm echo và exit ở cuối hàm
        echo json_encode($this->response);
        exit();
    }

    public function userEnrerOtp(){
        if(!isset($_SESSION['reset_email'])){
            $this->response['success'] = false;
            $this->response['message'] = 'Phiên làm việc hết hạn. Vui lòng thử lại.';
            // Sửa: Phải echo trước khi exit
            echo json_encode($this->response);
            exit();
        }

        $email = $_SESSION['reset_email'];
        $otp = $_POST['otp'] ?? '';
        $validateOtp = $this->userModelResetPass->validateOTP($email, $otp);

        if($validateOtp){
            $_SESSION['is_verified'] = true;
            $this->userModelResetPass->clearOtpAfterUsed($email);

            $this->response['success'] = true;
            $this->response['message'] = 'Verify OTP code successfully!';
            $this->response['redirectUrl'] = '/todoList/todo_list_web/client/src/pages/forgotPassword/ResetPassword.html';
        } else {
            $this->response['success'] = false;
            $this->response['message'] = 'OTP code incorrect or expired!';
        }
        
        // Sửa: Thêm echo và exit ở cuối hàm
        echo json_encode($this->response);
        exit();
    }

    public function handleResetPassword(){
        if(!isset($_SESSION['is_verified']) || !isset($_SESSION['reset_email'])){
            $this->response['success'] = false;
            $this->response['message'] = "Truy cập không hợp lệ.";
            // Sửa: Phải echo trước khi exit
            echo json_encode($this->response);
            exit();
        }

        $email = $_SESSION['reset_email'];
        $newPassword = $_POST['new_password'] ?? '';
        $confirmPasswprd = $_POST['confirm_password'] ?? '';

        if($newPassword !== $confirmPasswprd){
            // Sửa: Đây là lỗi, success phải là false
            $this->response['success'] = false; 
            $this->response['message'] = 'Confirm password incorrect!';
            // Sửa: Phải echo trước khi exit
            echo json_encode($this->response);
            exit();
        } else {
            $hashPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $this->userModelResetPass->updateNewPassword($email, $hashPassword);

            unset($_SESSION['reset_email']);
            unset($_SESSION['is_verified']);
            $this->response['success'] = true;
            $this->response['message'] = 'Update your new password successfully!';
            $this->response['redirectUrl'] = '/todoList/todo_list_web/client/src/pages/signInPages/SignIn.html';
        }

        // Sửa: Thêm echo và exit ở cuối hàm
        echo json_encode($this->response);
        exit();
    }
}

?>