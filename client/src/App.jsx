import { useState } from 'react';
import SignIn from "./pages/signInPages/SignIn.jsx";
import SignUp from "./pages/signUpPages/SignUp.jsx"; // Import trang mới
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State để kiểm soát đang ở trang Login hay Register
  // 'signin' | 'signup'
  const [currentPage, setCurrentPage] = useState('signin'); 

  const handleLoginSuccess = () => {
      setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
          <Dashboard />
      ) : (
          // Logic chuyển trang
          currentPage === 'signin' ? (
             // Truyền hàm để SignIn có thể gọi khi user bấm nút "Registration" (nếu bạn thêm nút đó)
             <SignIn 
                onLoginSuccess={handleLoginSuccess} 
                // Bạn có thể thêm nút chuyển sang SignUp trong SignIn.jsx và gọi prop này
                // onSwitchToSignUp={() => setCurrentPage('signup')} 
             />
          ) : (
             // Trang SignUp
             <SignUp onSwitchToSignIn={() => setCurrentPage('signin')} />
          )
      )}
      
      {/* Nút test tạm thời để bạn chuyển qua lại giữa 2 trang */}
      {!isLoggedIn && (
          <div style={{position: 'fixed', top: 10, right: 10, zIndex: 9999}}>
              <button onClick={() => setCurrentPage('signin')}>Go to Login</button>
              <button onClick={() => setCurrentPage('signup')}>Go to Sign Up</button>
          </div>
      )}
    </>
  );
}

export default App;