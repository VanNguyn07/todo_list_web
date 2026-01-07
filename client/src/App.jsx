import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import SignIn from "./pages/signInPages/SignIn.jsx";
import SignUp from "./pages/signUpPages/SignUp.jsx";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.jsx";
import VerifyOtp from "./pages/forgotPassword/VerifyOtp.jsx";
import ResetPassword from "./pages/forgotPassword/ResetPassword.jsx";
import AdminDashboard from "./pages/admin/app/page.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("my_username") !== null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role_admin");
  })

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setRole(localStorage.getItem("role_admin"));
  }
  return (
    <Routes>
      {/* path="/dashboard": Khi trình duyệt là localhost:3000/dashboard
         element={<Dashboard />}: Thì hiện component Dashboard
       */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            role === "admin" ? (
              <Navigate to="/admin" replace/>
            ):
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/signin"
        element={<SignIn onLoginSuccess={handleLoginSuccess} />}
      />  
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/admin"
        element={isLoggedIn && role === "admin" ? <AdminDashboard /> : <Navigate to="/signin" replace />}
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifyotp" element={<VerifyOtp />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
