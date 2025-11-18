import React, { useState } from "react";
import "./SignUp.css"; // File CSS đã được sửa lỗi (ở bước 2)
import "./ResponsiveSignUp.css";

// Import hình ảnh
import astronautImg from "../../assets/images/astronaut.png";

// Component nhận 1 prop: hàm để quay lại trang SignIn
const SignUp = ({ onSwitchToSignIn }) => {
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    inputUserName: "",
    inputEmail: "",
    inputPassword: "",
    confirmPassword: "",
    gender: "",
  });

  // State lưu lỗi validation
  const [errors, setErrors] = useState({});

  // State quản lý hiệu ứng rung
  const [shaking, setShaking] = useState({});

  // Hàm cập nhật state khi gõ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Xóa lỗi khi người dùng bắt đầu gõ
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Hàm kích hoạt rung
  const triggerShake = (field) => {
    setShaking((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShaking((prev) => ({ ...prev, [field]: false }));
    }, 300); // 300ms khớp với animation
  };

  // Hàm check email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Hàm xử lý khi bấm nút "Create Account"
  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    // 1. Validate Username
    if (!formData.inputUserName) {
      newErrors.inputUserName = "User Name can not empty!";
      triggerShake("inputUserName");
      valid = false;
    }

    // 2. Validate Email
    if (!formData.inputEmail) {
      newErrors.inputEmail = "Email can not empty!";
      triggerShake("inputEmail");
      valid = false;
    } else if (!isValidEmail(formData.inputEmail)) {
      newErrors.inputEmail = "Email is in incorrect format!";
      triggerShake("inputEmail");
      valid = false;
    }

    // 3. Validate Password
    if (!formData.inputPassword) {
      newErrors.inputPassword = "Password can not empty!";
      triggerShake("inputPassword");
      valid = false;
    }

    // 4. Validate Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password!";
      triggerShake("confirmPassword");
      valid = false;
    } else if (formData.confirmPassword !== formData.inputPassword) {
      newErrors.confirmPassword = "Confirm password incorrect!";
      triggerShake("confirmPassword");
      valid = false;
    }

    // 5. Validate Gender
    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
      triggerShake("gender"); // Sẽ rung thẻ div.radioBox
      valid = false;
    }

    setErrors(newErrors);

    // Nếu tất cả đều OK -> Gửi API
    if (valid) {
      try {
        const dataToSend = new FormData();
        dataToSend.append("inputUserName", formData.inputUserName);
        dataToSend.append("inputEmail", formData.inputEmail);
        dataToSend.append("inputPassword", formData.inputPassword);
        dataToSend.append("gender", formData.gender);

        // Gửi request đến server Laragon
        const response = await fetch("/api/signUpApi.php", {
          method: "POST",
          body: dataToSend,
        });

        const data = await response.json();

        if (data.success) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          if (onSwitchToSignIn) onSwitchToSignIn(); // Quay lại trang login
        } else {
          // Hiển thị lỗi từ server (ví dụ: "Email đã tồn tại")
          setErrors({ server: data.message || "Đăng ký thất bại" });
        }
      } catch (error) {
        console.error("Lỗi kết nối server:", error);
        setErrors({ server: "Không thể kết nối đến máy chủ." });
      }
    }
  };

  return (
    <div className="SCOPE_SIGN_UP_PAGE">
      <div className="signUpPageWrapper animate__animated animate__fadeIn">
        <div className="containerDark">
          <h1 id="titleSignUp">Simple Sign Up Screen</h1>
          <form id="form" onSubmit={handleSubmit}>
            {/* --- CỘT TRÁI (Trang trí) --- */}
            <div className="formInterface">
              <div className="specLogoNew">
                <div className="imgSpec">
                  <img
                    src="https://tb-static.uber.com/prod/image-proc/processed_images/c5a0d37ae7b51be22093ec988638feb0/3ac2b39ad528f8c8c5dc77c59abb683d.jpeg"
                    alt="Logo"
                    className="logo"
                  />
                </div>
                <div className="title">
                  <div id="spec">
                    <p>SPEC'S</p>
                  </div>
                  <div id="projector">
                    <p>PROJECTOR</p>
                  </div>
                </div>
              </div>

              <div className="contentLeft">
                <div className="art">
                  <img src={astronautImg} alt="icon" className="icon" />
                </div>
              </div>
              <div id="text">
                <p>
                  Welcome aboard my friend
                  <br />
                  <span id="subText">just a couple of clicks and we start</span>
                </p>
              </div>
              <div className="pager">
                <div id="circle1">
                  <div id="subCircle1"></div>
                </div>
                <div id="circle2"></div>
                <div id="circle3"></div>
              </div>
            </div>

            {/* --- CỘT PHẢI (Form) --- */}
            <div className="formSignUp">
              <div id="Welcome">
                <p>Welcome</p>
              </div>

              <div className="input-stack">
                {/* UserName */}
                <div className="input-UserName">
                  <input
                    type="text"
                    name="inputUserName"
                    placeholder="User Name"
                    value={formData.inputUserName}
                    onChange={handleChange}
                    className={shaking.inputUserName ? "shakeError" : ""}
                  />
                  <i className="fa-solid fa-user"></i>
                  {errors.inputUserName && (
                    <div className="input-error">{errors.inputUserName}</div>
                  )}
                </div>

                {/* Email */}
                <div className="input-email">
                  <input
                    type="email"
                    name="inputEmail"
                    placeholder="Email"
                    value={formData.inputEmail}
                    onChange={handleChange}
                    className={shaking.inputEmail ? "shakeError" : ""}
                  />
                  <i className="fa-solid fa-envelope"></i>
                  {errors.inputEmail && (
                    <div className="input-error">{errors.inputEmail}</div>
                  )}
                </div>

                {/* Password */}
                <div className="input-password">
                  <input
                    type="password"
                    name="inputPassword"
                    placeholder="Password"
                    value={formData.inputPassword}
                    onChange={handleChange}
                    className={shaking.inputPassword ? "shakeError" : ""}
                  />
                  <i className="fa-solid fa-lock"></i>
                  {errors.inputPassword && (
                    <div className="input-error">{errors.inputPassword}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="input-confirmPass">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={shaking.confirmPassword ? "shakeError" : ""}
                  />
                  <i className="fa-solid fa-square-check"></i>
                  {errors.confirmPassword && (
                    <div className="input-error">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              {/* Gender Radio */}
              <div className={`radioBox ${shaking.gender ? "shakeError" : ""}`}>
                <i className="fa-solid fa-venus-mars"></i>
                <label htmlFor="" id="gender">
                  Gender
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />{" "}
                  Male
                  <i className="fa-solid fa-mars"></i>
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />{" "}
                  Female
                  <i className="fa-solid fa-venus"></i>
                </label>
              </div>
              {/* Nơi hiển thị lỗi Gender */}
              {errors.gender && (
                <div className="input-error gender-error">{errors.gender}</div>
              )}

              <div className="button-create">
                <button type="submit" id="buttonCreate">
                  Create Account
                  <i className="fa-solid fa-user-plus" id="userPlus"></i>
                </button>
              </div>

              {/* Nút quay lại Login */}
              <div className="registration">
                <div id="accountYet" style={{ cursor: "pointer" }}>
                  <a href="../signInPages/SignIn.jsx">
                    Already have an account? Sign In
                  </a>
                </div>
              </div>

              {/* Hiển thị lỗi từ Server */}
              {errors.server && (
                <div className="input-error server-error">{errors.server}</div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
