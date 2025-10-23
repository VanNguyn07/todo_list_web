const submitForm = document.getElementById('forgotForm');
const inputEmail = document.getElementById('email');

const btnSendOtpCode = document.getElementById('submitButton');
const message = document.getElementById('message');

function shakeInput(prop){
    prop.classList.add("shakeError")
    // Xóa hiệu ứng sau khi animation chạy xong để có thể lặp lại
        setTimeout(() => {
        prop.classList.remove("shakeError");
        }, 300); // 300ms trùng với thời gian animation
}

submitForm.addEventListener("submit", function(event){
    event.preventDefault();

    let valid = true;
    if(!inputEmail.value){
        message.textContent = 'Please enter your email to varification!'
        message.style.color = 'red';
        shakeInput(inputEmail);
        valid = false;
    }

    if(valid){
        // Tạo đối tượng FormData để thu thập dữ liệu từ form
        const formData = new FormData(submitForm);
        formData.append('action', 'send_otp');
         // Log formData để kiểm tra (optional, chỉ debug)
        console.log('Sending data: ', Object.fromEntries(formData));
        // Sử dụng fetch để gửi request đến controller
        
        btnSendOtpCode.disabled = true; // Vô hiệu hóa nút bấm
        message.textContent = 'Handling...'
        message.style.color = 'black';

        const API_URL = './index.php';
        fetch(API_URL, {
            method: 'POST', 
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                message.textContent = data.message;
                message.style.color = 'green';
                // 2. Tự động chuyển trang sau 2 giây
                setTimeout(()=>{
                    window.location.href = data.redirectUrl;
                }, 2000);
            } else {
                message.textContent = data.message;
                message.style.color = 'red';
                shakeInput(inputEmail);
                btnSendOtpCode.disabled = false;
            }
        })
        .catch(error => {
            // Xử lý các lỗi mạng hoặc server không phản hồi
            console.error('Lỗi AJAX:', error);
            message.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
            message.style.color = 'red';
            btnSendOtpCode.disabled = false;
        })
    }
})