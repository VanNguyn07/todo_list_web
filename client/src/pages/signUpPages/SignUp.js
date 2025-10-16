const form = document.getElementById("form");
const inputUserNameElement = document.getElementById("inputUserName");
const inputEmailElement = document.getElementById("inputEmail");
const inputPasswordElement = document.getElementById("inputPassword");
const inputConfirmPasswordElement = document.getElementById("confirmPassword");

const userNameErrorElement = document.getElementById("userNameError");
const emailErrorElement = document.getElementById("emailError");
const emailErrorFormatElement = document.getElementById("emailErrorFormat");
const passwordErrorElement = document.getElementById("passwordError");
const confirmPassword1ErrorElement = document.getElementById("confirmPassError1");
const confirmPassword2ErrorElement = document.getElementById("confirmPassError2");

function shakeInput(prop){
    prop.classList.add("errorUserNameAndEmail")
    // Xóa hiệu ứng sau khi animation chạy xong để có thể lặp lại
        setTimeout(() => {
        prop.classList.remove("errorUserNameAndEmail");
        }, 300); // 300ms trùng với thời gian animation
}

//   simple email check (cơ bản)
function isValidEmail(email) {
   const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return pattern.test(email);
}
// Example usage
const email = "example@domain.com";
console.log(isValidEmail(email) ? "Valid email" : "Invalid email");

form.addEventListener("submit", function(event) {
    event.preventDefault(); // Chặn reload trang

    let valid = true;

    // Check username
    if (!inputUserNameElement.value.trim()) {
        userNameErrorElement.style.display = "block";
        shakeInput(inputUserNameElement)
        valid = false;
    } else {
        userNameErrorElement.style.display = "none";
        localStorage.setItem("username", inputUserNameElement.value); // Lưu username vào localStorage  
    }

    // Check Password
    if (!inputPasswordElement.value.trim()) {
        passwordErrorElement.style.display = "block";
        shakeInput(inputPasswordElement)
        valid = false;
    } else {
        passwordErrorElement.style.display = "none";
        localStorage.setItem("password", inputPasswordElement.value); // Lưu password vào localStorage
    }

    // Check email
    if (!inputEmailElement.value.trim()) {
        emailErrorElement.style.display = "block";
        shakeInput(inputEmailElement)
        valid = false;
    } else if(!isValidEmail(inputEmailElement.value)){
        emailErrorFormatElement.style.display = "block";
        shakeInput(inputEmailElement);
        valid = false;
    } else {
        emailErrorElement.style.display = "none";
        emailErrorFormatElement.style.display = "none";
    }

    // Check Confirm Password rỗng
    if (!inputConfirmPasswordElement.value) {
        confirmPassword1ErrorElement.style.display = "block";
        shakeInput(inputConfirmPasswordElement);
        valid = false;
    } else {
        confirmPassword1ErrorElement.style.display = "none";
    }

    // Check Confirm Password không khớp
    if(inputPasswordElement.value !== inputConfirmPasswordElement.value){
        confirmPassword2ErrorElement.style.display = "block";
        shakeInput(inputPasswordElement);
        shakeInput(inputEmailElement);
        valid = false;
    }else {
        confirmPassword2ErrorElement.style.display = "none";
    }

        // Nếu tất cả hợp lệ → chuyển trang
    if (valid) {
        window.location.href = "../signInPages/SignIn.html";
    }
});
