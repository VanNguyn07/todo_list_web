// Lấy ra elements của trang 
const form = document.getElementById("form");
const inputUserNameElement = document.getElementById("inputUserName");
const inputPasswordElement = document.getElementById("inputPassword");
const gender = document.getElementById('gender-group');
const role = document.getElementById('role-group');

// Lấy ra elements error của trang
const userNameErrorElement = document.getElementById("userNameError");
const errorPasswordElement = document.getElementById("passwordError");
const errorPasswordIncorrectElement = document.getElementById("passwordErrorIncorrect");
const errorGender = document.getElementById("errorGender");
const errorRole = document.getElementById("errorRole");
// Lấy ra button GG và GitHub
const buttonGGElement = document.getElementById("button-Google");
const buttonGitHubElement = document.getElementById("button-GitHub");

//Lấy ra button registratioin 
const buttonSignUpElement = document.getElementById("button-SignUp");

// Lấy URl của Sign In gg 
const urlGGSignIn = "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=YOUR_CLIENT_ID.apps.googleusercontent.com" +
        "&redirect_uri=YOUR_REDIRECT_URI" +
        "&response_type=code" +
        "&scope=email%20profile%20openid" +
        "&access_type=online";

function shakeInput(prop){
    prop.classList.add("shakeError")
    // Xóa hiệu ứng sau khi animation chạy xong để có thể lặp lại
        setTimeout(() => {
        prop.classList.remove("shakeError");
        }, 300); // 300ms trùng với thời gian animation
}

// lắng nghe sự kiện submit của form
form.addEventListener("submit", function(event){
    // ngăn chặn hành động sự kiện load lại trang
    event.preventDefault()

    let valid = true;
    // validate(xác thực) dữ liệu đầu vào 
    if(!inputUserNameElement.value){
        userNameErrorElement.style.display = "block";
        shakeInput(inputUserNameElement);
        valid = false;
    }else {
        userNameErrorElement.style.display = "none";
    }
    
    if(!inputPasswordElement.value){
        errorPasswordElement.style.display = "block";
        shakeInput(inputPasswordElement);
        valid = false;
    } else {
        errorPasswordElement.style.display = "none";
    }

    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if(!genderSelected.value){
        errorGender.style.display = "block";
        shakeInput(gender);
        valid = false;
    }else {
        errorGender.style.display = "none";
    }

    const roleSelected = document.querySelector('input[name="role"]:checked');
    if(!roleSelected.value){
        errorRole.style.display = "block";
        shakeInput(role);
        valid = false;
    }else {
        errorRole.style.display = "none";
    }

    // nếu không có lỗi thì thực hiện đăng nhập
    if(valid){
        errorPasswordIncorrectElement.style.display = "none";
        // Tạo đối tượng FormData để thu thập dữ liệu từ form
        const formData = new FormData(form);
        // Log formData để kiểm tra (optional, chỉ debug)
        console.log('Sending data:', Object.fromEntries(formData));

        // Sử dụng fetch để gửi request đến controller
        fetch('../../../../server/app/controllers/UserControllerSignIn.php', {
            method: 'POST',
            body: formData  
        })
        .then(response => {
            console.log('Response status:', response.status);  // Log status (nếu 404 thì đường dẫn sai)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();  // Chuyển đổi phản hồi thành JSON
        })
        .then(data => { // Xử lý dữ liệu JSON nhận được
            console.log('Received data:', data);  // Log data để xem PHP trả gì
            if(data.success){
                // Nếu PHP báo thành công, chuyển hướng trang
                window.location.href = data.redirectUrl;
            }else {
                // Nếu PHP báo thất bại, hiển thị thông báo lỗi
                if (data.field === 'username') {
                    userNameErrorElement.textContent = data.message;
                    userNameErrorElement.style.display = "block";
                    shakeInput(inputUserNameElement);

                } else if (data.field === 'password') {
                    errorPasswordElement.textContent = data.message;
                    errorPasswordElement.style.display = "block";
                    shakeInput(inputPasswordElement);

                } else if (data.field === 'gender') {
                    errorGender.textContent = data.message;
                    errorGender.style.display = "block";
                    shakeInput(gender);
                    
                } else if(data.field === "role"){
                    errorRole.textContent = data.message;
                    errorRole.style.display = "block";
                    shakeInput(role);
                }
                else {
                    // Nếu PHP không trả về 'field' cụ thể, rung 2 cái chính
                    shakeInput(inputUserNameElement);
                    shakeInput(inputPasswordElement);
                }
            }
        })
        .catch(error =>{
            // Xử lý các lỗi mạng hoặc server không phản hồi
            console.error('Lỗi AJAX:', error);
            errorPasswordIncorrectElement.textContent = 'Không thể kết nối đến máy chủ.';
            errorPasswordIncorrectElement.style.display = 'block';
        })
    } 
});


// Lắng nghe sự kiện click của button GG
buttonGGElement.addEventListener("click", function(){
   window.open(urlGGSignIn, "_blank");
})

// Lắng nghe sự kiện click của button GitHub
buttonGitHubElement.addEventListener("click", function(){
    window.open("https://github.com/login", "_blank");
})

// Lắng nghe sự kiện click của button Sign Up
buttonSignUpElement.addEventListener("click", function(){
    window.location.href = '../signUpPages/SignUp.html'
})