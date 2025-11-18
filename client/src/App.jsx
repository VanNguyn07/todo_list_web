import { useState } from "react";
import SignIn from "./pages/signInPages/SignIn.jsx";
import SignUp from "./pages/signUpPages/SignUp.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.jsx";
import VerifyOtp from "./pages/forgotPassword/VerifyOtp.jsx";
import ResetPassword from "./pages/forgotPassword/ResetPassword.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Các trạng thái trang: 'signin', 'signup', 'forgot', 'verify_otp', 'reset'
  const [currentPage, setCurrentPage] = useState("signin");

  return (
    <>
      {isLoggedIn ? (
        <Dashboard />
      ) : currentPage === "signin" ? (
        <SignIn
          onLoginSuccess={() => setIsLoggedIn(true)}
          onSwitchToSignUp={() => setCurrentPage("signup")}
          onSwitchToForgot={() => setCurrentPage("forgot")}
        />
      ) : currentPage === "signup" ? (
        <SignUp onSwitchToSignIn={() => setCurrentPage("signin")} />
      ) : currentPage === "forgot" ? (
        <ForgotPassword 
            onSwitchToSignIn={() => setCurrentPage("signin")}
            // Nếu gửi email thành công -> chuyển sang trang Verify OTP
            onSwitchToVerify={() => setCurrentPage("verify_otp")} 
        />
      ) : currentPage === "verify_otp" ? (
        <VerifyOtp 
            // Nếu nhập đúng OTP -> chuyển sang trang Reset Password
            onVerifySuccess={() => setCurrentPage("reset")}
            // Nút Back quay lại nhập Email
            onBack={() => setCurrentPage("forgot")}
        />
      ) : (
        // Trang Reset Password
        <ResetPassword onResetSuccess={() => setCurrentPage("signin")} />
      )}
    </>
  );
}

export default App;