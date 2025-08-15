import { sendHTTPRequests } from "./utils/functions.js";

const resetBtn = document.getElementById("resetBtn");
const resetPasswordMessage = document.getElementById("resetPasswordMessage");

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

resetBtn.addEventListener("click", async () => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        resetPasswordMessage.textContent = "Passwords do not match.";
        resetPasswordMessage.style.color = "red";
        return;
    }

    const response = await sendHTTPRequests(
        "http://localhost:3000/forgotpassword/reset",
        "POST",
        JSON.stringify({ token, newPassword })
    );
    if (response && response.success) {
        resetPasswordMessage.textContent = "Password reset successfully.";
        resetPasswordMessage.style.color = "green";
        setTimeout(() => {
            window.location.href = "./loginPage.html";
        }, 1500);
    } else {
        resetPasswordMessage.textContent = response && response.message ? response.message : "Error resetting password.";
        resetPasswordMessage.style.color = "red";
    }
});