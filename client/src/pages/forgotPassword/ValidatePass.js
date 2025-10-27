const validateForm = document.getElementById('validateForm');
const inputOtp = document.getElementById('otp');
const btnValidate = document.getElementById('submitButton');
const message = document.getElementById('message_display');

function shakeInput(prop){
    prop.classList.add("shakeError")
    // Xóa hiệu ứng sau khi animation chạy xong để có thể lặp lại
        setTimeout(() => {
        prop.classList.remove("shakeError");
        }, 300); // 300ms trùng với thời gian animation
}


validateForm.addEventListener("submit", function(event){
    event.preventDefault();

    let valid = true;
    if(!inputOtp.value){
        message.textContent = "Please enter OTP code so we have sent for you!";
        message.style.color = 'red';
        shakeInput(inputOtp);
        valid = false;
    }

    if(valid){
        const formData = new FormData(validateForm);
        formData.append('action', 'verification_code_otp');
        console.log('Sending data: ', Object.fromEntries(formData));

        btnValidate.disabled = true;
        message.textContent = 'Checking OTP Code!';
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
                setTimeout(()=>{
                    window.location.href = data.redirectUrl;
                }, 1500)
            }else {
                message.textContent = data.message;
                message.style.color = 'red';
                shakeInput(inputOtp);
                btnValidate.disabled = false;
            }
        }).catch(error => {
            // Xử lý các lỗi mạng hoặc server không phản hồi
            console.error('Lỗi AJAX:', error);
            message.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
            message.style.color = 'red';
            btnValidate.disabled = false;
        })
    }
})