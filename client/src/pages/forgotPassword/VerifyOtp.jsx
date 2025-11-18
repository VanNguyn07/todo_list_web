import React, { useState } from 'react';
import './style.css'; 

const VerifyOtp = ({ onVerifySuccess, onBack }) => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // Hàm tạo hiệu ứng rung
    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => {
            setIsShaking(false);
        }, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validation
        if (!otp) {
            setMessage({ text: "Please enter OTP code we sent you!", type: "error" });
            triggerShake();
            return;
        }

        // 2. Gửi API
        setIsLoading(true);
        setMessage({ text: "Checking OTP Code...", type: "loading" });

        const formData = new FormData();
        formData.append("otp", otp);
        // Action phải khớp với switch case trong file PHP của bạn
        formData.append("action", "verification_code_otp"); 

        try {
            // Gọi qua Proxy /api
            const API_URL = "/api/forgotPasswordApi.php";
            
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ text: data.message, type: "success" });
                
                // Chuyển sang trang Reset Password sau 1.5s
                setTimeout(() => {
                    if (onVerifySuccess) {
                        onVerifySuccess(); // Gọi hàm từ App.jsx để chuyển trang
                    }
                }, 1500);

            } else {
                setMessage({ text: data.message, type: "error" });
                triggerShake();
            }

        } catch (error) {
            console.error("Lỗi AJAX:", error);
            setMessage({ text: "Lỗi kết nối. Vui lòng thử lại.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="SCOPE_VERIFY_OTP">
            <div className="verifyContainer animate__animated animate__fadeInDown">
                <form onSubmit={handleSubmit} id="validateForm">
                    <h2>Verify OTP code</h2>
                    <p className="desc">We have sent OTP code to your email. Please check!</p>
                    
                    <div className="content-verify">
                        <label htmlFor="otp">Enter OTP:</label>
                        <input 
                            type="text" 
                            id="otp" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={isShaking ? 'shakeError' : ''}
                            placeholder="Ex: 123456"
                            disabled={isLoading}
                        />
                        
                        <button 
                            type="submit" 
                            id="submitButton" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>

                    <div className={`message-box ${message.type}`}>
                        {message.text && <span>{message.text}</span>}
                    </div>

                    {/* Nút quay lại nếu muốn nhập lại email */}
                    <div className="back-link">
                         <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                            ← Back
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;