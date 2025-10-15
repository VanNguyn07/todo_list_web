const form = document.getElementById("form");
const inputUserNameElement = document.getElementById("inputUserName");
const inputEmailElement = document.getElementById("inputEmail");
const inputPasswordElement = document.getElementById("inputPassword");
const inputConfirmPasswordElement = document.getElementById("confirmPassword");

const userNameErrorElement = document.getElementById("userNameError");
const emailErrorElement = document.getElementById("emailError");
const passwordErrorElement = document.getElementById("passwordError");
const confirmPassword1ErrorElement = document.getElementById("confirmPassError1");
const confirmPassword2ErrorElement = document.getElementById("confirmPassError2");

form.addEventListener("submit", function(event) {
    event.preventDefault(); // Chặn reload trang

    let valid = true;

    // Check username
    if (!inputUserNameElement.value) {
        userNameErrorElement.style.display = "block";
        valid = false;
    } else {
        userNameErrorElement.style.display = "none";
        localStorage.setItem("username", inputUserNameElement.value); // Lưu username vào localStorage  
    }

    // Check Password
    if (!inputPasswordElement.value) {
        passwordErrorElement.style.display = "block";
        valid = false;
    } else {
        passwordErrorElement.style.display = "none";
        localStorage.setItem("password", inputPasswordElement.value); // Lưu password vào localStorage
    }

    // Check email
    if (!inputEmailElement.value) {
        emailErrorElement.style.display = "block";
        valid = false;
    } else {
        emailErrorElement.style.display = "none";
    }

    // Check Confirm Password rỗng
    if (!inputConfirmPasswordElement.value) {
        confirmPassword1ErrorElement.style.display = "block";
        valid = false;
    } else {
        confirmPassword1ErrorElement.style.display = "none";
    }

    // Check Confirm Password không khớp
    if(inputPasswordElement.value !== inputConfirmPasswordElement.value){
        confirmPassword2ErrorElement.style.display = "block";
        valid = false;
    }else {
        confirmPassword2ErrorElement.style.display = "none";
    }

        // Nếu tất cả hợp lệ → chuyển trang
    if (valid) {
        window.location.href = "../signInPages/SignIn.html";
    }
});
