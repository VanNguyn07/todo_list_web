import React, { useState } from "react";
import "./SignIn.css";
import "./ResponsiveSignIn.css";

import astronautImg from "../../assets/images/astronaut.png";
import googleIcon from "../../assets/images/google.png";
import githubIcon from "../../assets/images/github.png";

const SignIn = ({ onLoginSuccess, onSwitchToSignUp, onSwitchToForgot }) => {
  const [formData, setFormData] = useState({
    inputUserName: "",
    inputPassword: "",
    gender: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    gender: "",
    general: "",
  });

  // Trạng thái rung cho từng trường
  const [shaking, setShaking] = useState({
    username: false,
    password: false,
    gender: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "", general: "" }); // Xóa lỗi khi gõ
  };

  const triggerShake = (field) => {
    setShaking((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShaking((prev) => ({ ...prev, [field]: false }));
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { username: "", password: "", gender: "", general: "" };

    // --- VALIDATION ---
    if (!formData.inputUserName) {
      newErrors.username = "User Name can not empty!";
      triggerShake("username");
      valid = false;
    }

    if (!formData.inputPassword) {
      newErrors.password = "Password can not empty!";
      triggerShake("password");
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Incorrect gender selection!";
      triggerShake("gender");
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const dataToSend = new FormData();
        dataToSend.append("inputUserName", formData.inputUserName);
        dataToSend.append("inputPassword", formData.inputPassword);
        dataToSend.append("gender", formData.gender);

        const response = await fetch("/api/signInApi.php", {
          method: "POST",
          body: dataToSend,
        });
        const data = await response.json();

        if (data.success) {
          if (onLoginSuccess) onLoginSuccess();
        } else {
          // Xử lý lỗi từ Server trả về
          if (data.field === "username") {
            setErrors((prev) => ({ ...prev, username: data.message }));
            triggerShake("username");
          } else if (data.field === "password") {
            setErrors((prev) => ({ ...prev, password: data.message }));
            triggerShake("password");
          } else if (data.field === "gender") {
            setErrors((prev) => ({ ...prev, gender: data.message }));
            triggerShake("gender");
          } else {
            setErrors((prev) => ({
              ...prev,
              general: data.message || "Login failed",
            }));
            triggerShake("username");
            triggerShake("password");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors((prev) => ({
          ...prev,
          general: "Server connection failed.",
        }));
      }
    }
  };

  return (
    // Thêm class wrapper để căn giữa màn hình
    <div className="SCOPE_SIGN_IN_PAGE">
      <div className="signInPageWrapper animate__animated animate__fadeIn">
        <h1 id="titleSignIn">Simple Sign Up Screen</h1>
        <div id="form">
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
          {/* --- CỘT PHẢI (Form đăng nhập) --- */}
          <form className="formSignIn" onSubmit={handleSubmit}>
            <div id="Welcome">
              <p>Welcome</p>
            </div>

            <div className="input-stack-signIn">
              {/* USER NAME INPUT */}
              <div className="input-UserName">
                <input
                  type="text"
                  name="inputUserName"
                  placeholder="User Name"
                  value={formData.inputUserName}
                  onChange={handleChange}
                  // Class rung gắn thẳng vào input
                  className={shaking.username ? "shakeError" : ""}
                />
                <i className="fa-solid fa-user"></i>
                {/* Lỗi hiển thị bên dưới input */}
                {errors.username && (
                  <div className="input-error">{errors.username}</div>
                )}
              </div>

              {/* PASSWORD INPUT */}
              <div className="input-password">
                <input
                  type="password"
                  name="inputPassword"
                  placeholder="Password"
                  value={formData.inputPassword}
                  onChange={handleChange}
                  className={shaking.password ? "shakeError" : ""}
                />
                <i className="fa-solid fa-lock"></i>

                {errors.password && (
                  <div className="input-error">{errors.password}</div>
                )}
                {errors.general && (
                  <div className="input-error">{errors.general}</div>
                )}
              </div>
            </div>

            {/* GENDER INPUT */}
            <div className="gende-groupAndError">
              <div
                id="gender-group"
                className={shaking.gender ? "shakeError" : ""}
              >
                <i className="fa-solid fa-venus-mars"></i>
                <label id="gender">Gender</label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="female-Male"
                    onChange={handleChange}
                    checked={formData.gender === "male"}
                  />{" "}
                  Male
                  <i className="fa-solid fa-mars"></i>
                </label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="female-Male"
                    onChange={handleChange}
                    checked={formData.gender === "female"}
                  />{" "}
                  Female
                  <i className="fa-solid fa-venus"></i>
                </label>
              </div>
              {errors.gender && <div id="errorGender">{errors.gender}</div>}
            </div>

            <div id="forgot-password">
              {/* 2. Sửa thẻ a như sau: */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Ngăn không cho tải lại trang
                  onSwitchToForgot(); // Gọi hàm chuyển trang
                }}
              >
                Forgot password?
              </a>
            </div>

            <div className="button-stack">
              <div className="containerLoginAndGG-GitHub">
                <button type="submit" id="button-LogIn">
                  Log in
                </button>
                <div id="divider">
                  <span>Or</span>
                </div>

                <div className="button-GoogleAndGitHub">
                  <button type="button" id="button-Google">
                    <img src={googleIcon} alt="G" className="iconGoogle" />{" "}
                    Google
                  </button>
                  <button type="button" id="button-GitHub">
                    <img src={githubIcon} alt="GH" className="iconGitHub" />{" "}
                    GitHub
                  </button>
                </div>
              </div>
              <div className="registration">
                <div id="accountYet">Have no account yet?</div>
                <button
                  type="button"
                  id="button-SignUp"
                  onClick={onSwitchToSignUp}
                >
                  Registration
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
