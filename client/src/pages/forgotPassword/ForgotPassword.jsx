import React, { useState } from "react";
import "./style.css";

const ForgotPassword = ({ onSwitchToSignIn, onSwitchToVerify }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success', 'error', 'loading'
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Hàm xử lý hiệu ứng rung
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ngăn tải lại trang

    // 1. Validation
    if (!email) {
      setMessage({
        text: "Please enter your email to verification!",
        type: "error",
      });
      triggerShake();
      return; // dừng hàm
    }

    // 2. Gửi dữ liệu
    setIsLoading(true);
    setMessage({ text: "Handling...", type: "loading" });

    //tạo đối tượng FormData để đóng gói gửi dữ liệu đi
    const formData = new FormData();
    formData.append("email", email);
    formData.append("action", "send_otp");

    try {
      // dùng fetch để gọi API , dùng await để đợi server trả về kết quả
      const response = await fetch("/api/forgotPasswordApi.php", {
        method: "POST", // gửi request tới file /api/forgotPasswordApi.php
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });

        // Chuyển trang sau 1.5s
        setTimeout(() => {
          onSwitchToVerify();
        }, 1500);
      } else {
        setMessage({ text: data.message, type: "error" });
        triggerShake();
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setMessage({
        text: "Lỗi kết nối server. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Bọc class cha để cô lập CSS
    <div className="SCOPE_FORGOT_PASS">
      <div className="forgotContainer animate__animated animate__fadeInDown">
        <form onSubmit={handleSubmit} id="forgotForm">
          <h2 id="titleForSetPass">Forgot Password</h2>
          <p className="desc">
            Enter your email to receive a verification OTP code!
          </p>

          <div className="content-forgot-pass">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Class shakeError rung sẽ được tạo ra khi biến isShaking = true
              className={isShaking ? "shakeError" : ""}
              placeholder="example@gmail.com"
            />

            <button type="submit" id="submitButton" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP code"}
            </button>
          </div>

          {/* Khu vực hiển thị thông báo */}
          <div className={`message-box ${message.type}`}>
            {message.text && <span>{message.text}</span>}
          </div>

          {/* Nút quay lại trang đăng nhập */}
          <div className="back-link">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignIn();
              }}
            >
              ← Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
