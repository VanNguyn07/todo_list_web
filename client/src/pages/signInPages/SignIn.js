// Lấy ra elements của trang 
const form = document.getElementById("form");
const inputUserNameElement = document.getElementById("inputUserName");
const inputPasswordElement = document.getElementById("inputPassword");

// Lấy ra elements error của trang
const userNameErrorElement = document.getElementById("userNameError");
const errorPasswordElement = document.getElementById("passwordError");
const errorPassword1Element = document.getElementById("passwordErrorIncorrect");

// Lấy ra button GG và GitHub
const buttonGGElement = document.getElementById("button-Google");
const buttonGitHubElement = document.getElementById("button-GitHub");

//Lấy ra button registratioin 
const buttonSignUpElement = document.getElementById("button-SignUp");

//Lấy ra value từ localStorage
const savedUserName = localStorage.getItem("username");    
const savedPassword = localStorage.getItem("password");

// Lấy URl của Sign In gg 
const urlGGSignIn = "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=YOUR_CLIENT_ID.apps.googleusercontent.com" +
        "&redirect_uri=YOUR_REDIRECT_URI" +
        "&response_type=code" +
        "&scope=email%20profile%20openid" +
        "&access_type=online";

function shakeInput(prop){
    prop.classList.add("errorUserNameAndEmail")
    // Xóa hiệu ứng sau khi animation chạy xong để có thể lặp lại
        setTimeout(() => {
        prop.classList.remove("errorUserNameAndEmail");
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

    // nếu không có lỗi thì thực hiện đăng nhập
    if(valid){
        // Kiểm tra email và password có khớp với dữ liệu đã lưu trong localStorage không
        if(inputUserNameElement.value === savedUserName && inputPasswordElement.value === savedPassword){
            // Nếu khớp, chuyển hướng đến trang chính
            window.location.href = "https://vocabenglish.id.vn/";
        } else {
            // Nếu không khớp, hiển thị lỗi
            errorPassword1Element.style.display = "block";
            shakeInput(inputUserNameElement);
            shakeInput(inputPasswordElement);
        }
    } else {
        errorPassword1Element.style.display = "none"; // Ẩn lỗi nếu có lỗi khác
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
    window.transitionTo("../signUpPages/SignUp.html")
})