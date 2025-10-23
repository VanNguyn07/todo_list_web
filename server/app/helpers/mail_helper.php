<?php

// Nạp các lớp của PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// hàm gửi mã otp từ email 
function send_otp_from_email($email_receiver, $otp_code){
    $mailer = new PHPMailer(true);

    try {
    // cấu hình server 
    $mailer->isSMTP(); // turn on SMTP
    $mailer->Host = 'smtp.gmail.com';      // Máy chủ SMTP của Gmail
    $mailer->SMTPAuth = true; // turn on verify

    // info login your email
    $mailer->Username = 'vannguyen11a21@gmail.com';
    $mailer->Password = 'okii ytdx rwko agxm';

    $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // use SSL
    $mailer->Port = 465; //Port for SSL
    $mailer->CharSet = 'UTF-8';

    // email sender
    $mailer->setFrom('vannguyen11a21@gmail.com', 'Todo_List');

    // email receiver
    $mailer->addAddress($email_receiver);

    //content email
    $mailer->isHTML(true);
    $mailer->Subject = 'Mã OTP khôi phục mật khẩu của bạn';
    $mailer->Body = "Mã OTP của bạn là: <h2>$otp_code</h2>";

    //send email
    $mailer->send();
    return true;
    } catch( Exception $e){
        // Ném lỗi ra ngoài để Controller bắt
        throw new Exception("Không thể gửi email. Lỗi: {$mailer->ErrorInfo}");
    }
}