const resetPassForm = document.getElementById("resetPasswordForm");
const inputNewPassword = document.getElementById("new_password");
const inputConfirmPassword = document.getElementById("confirm_password");
const btnUpdatePassword = document.getElementById("btnUpdatePassword");
const message = document.getElementById("message_display");

function shakeInput(prop) {
  prop.classList.add("shakeError");
  // Xóa hiệu ứng sau khi animation chạy xong để có thể lặp lại
  setTimeout(() => {
    prop.classList.remove("shakeError");
  }, 300); // 300ms trùng với thời gian animation
}

resetPassForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let valid = true;
  if (!inputNewPassword.value) {
    message.textContent = "Please enter your new password!";
    message.style.color = "red";
    shakeInput(inputNewPassword);
    valid = false;
  } else if (!inputConfirmPassword.value) {
    message.textContent = "Please confirm your new password! ";
    message.style.color = "red";
    shakeInput(inputConfirmPassword);
    valid = false;
  } else if (inputNewPassword.value !== inputConfirmPassword.value) {
    message.textContent = "Confirm new password incorrect!";
    message.style.color = "red";
    shakeInput(inputNewPassword);
    shakeInput(inputConfirmPassword);
    valid = false;
  }

  if (valid) {
    const formData = new FormData(resetPassForm);
    formData.append("action", "reset_password");
    console.log("Sending data: ", Object.fromEntries(formData));

    btnUpdatePassword.disabled = true;
    message.textContent = "Checking...";
    message.style.color = "black";

    const API_URL = "../../../../server/services/forgotPasswordApi.php";
    fetch(API_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.textContent = data.message;
          message.style.color = "green";
          setTimeout(() => {
            window.location.href = data.redirectUrl;
          }, 1500);
        } else {
          message.textContent = data.message;
          message.style.color = "red";
          shakeInput(inputNewPassword);
          btnUpdatePassword.disabled = false;
        }
      })
      .catch((error) => {
        // Xử lý các lỗi mạng hoặc server không phản hồi
        console.error("Lỗi AJAX:", error);
        message.textContent = "Lỗi kết nối. Vui lòng thử lại.";
        message.style.color = "red";
        btnUpdatePassword.disabled = false;
      });
  }
});
