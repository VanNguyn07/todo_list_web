import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" }); // type: success/error/loading
  const [isLoading, setIsLoading] = useState(false);

  // State quản lý rung cho từng ô input
  const [shaking, setShaking] = useState({
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  // Hàm kích hoạt rung
  const triggerShake = (field) => {
    setShaking((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShaking((prev) => ({ ...prev, [field]: false }));
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // 1. Validation
    let valid = true;

    if (!passwords.new_password) {
      setMessage({ text: "Please enter your new password!", type: "error" });
      triggerShake("new");
      valid = false;
    } else if (!passwords.confirm_password) {
      setMessage({ text: "Please confirm your new password!", type: "error" });
      triggerShake("confirm");
      valid = false;
    } else if (passwords.new_password !== passwords.confirm_password) {
      setMessage({ text: "Confirm new password incorrect!", type: "error" });
      triggerShake("new");
      triggerShake("confirm");
      valid = false;
    }

    if (!valid) return;

    // 2. Gửi dữ liệu
    setIsLoading(true);
    setMessage({ text: "Checking...", type: "loading" });

    const formData = new FormData();
    formData.append("new_password", passwords.new_password);
    formData.append("confirm_password", passwords.confirm_password);
    formData.append("action", "reset_password");

    // *LƯU Ý: Nếu URL có token (ví dụ: ?token=abc), bạn cần lấy nó và gửi kèm
    // const urlParams = new URLSearchParams(window.location.search);
    // formData.append("token", urlParams.get('token'));

    try {
      // Dùng đường dẫn proxy /api
      const API_URL = "/api/forgotPasswordApi.php";

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });

        // Chuyển trang sau 1.5s
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } else {
        setMessage({ text: data.message, type: "error" });
        triggerShake("new");
        triggerShake("confirm");
      }
    } catch (error) {
      console.error("Lỗi AJAX:", error);
      setMessage({ text: "Lỗi kết nối. Vui lòng thử lại.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="SCOPE_RESET_PASS">
      <div className="resetContainer animate__animated animate__fadeIn">
        <form onSubmit={handleSubmit} id="resetForm">
          <h2 id="titleForSet-Forgot-Reset-Verify">Reset Your Password</h2>

          <div className="content-reset-pass">
            <div className="input-group-reset-pass">
              <label htmlFor="new_password">New password:</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                placeholder="New password"
                value={passwords.new_password}
                onChange={handleChange}
                className={shaking.new ? "shakeError" : ""}
                disabled={isLoading}
              />
            </div>

            <div className="input-group-reset-pass">
              <label htmlFor="confirm_password">Confirm password:</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm password"
                value={passwords.confirm_password}
                onChange={handleChange}
                className={shaking.confirm ? "shakeError" : ""}
                disabled={isLoading}
              />
            </div>

            <button type="submit" id="btnUpdatePassword" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update password"}
            </button>
          </div>

          <div className={`message-box ${message.type}`}>
            {message.text && <span>{message.text}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
