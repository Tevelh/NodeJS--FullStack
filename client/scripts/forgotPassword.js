import { sleepMode } from "./utils/functions.js";

export const sendHTTPRequests = async (url, body) => {
    let responseObject = await fetch(url, {
        method: "POST",
        body: body ? body : "",
        headers: {
            "content-type": "application/json"
        },
        credentials: "include"
    });
    if (!responseObject.ok) {
    let contentType = responseObject.headers.get("content-type") || "";
    const flag = contentType.includes("application/json");
    const response = flag ? await responseObject.json() : await responseObject.text();
    console.log("Response from server", ":", response);
    return response;
    }

}
document.getElementById("forgotBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const messageDiv = document.getElementById("forgotPasswordMessage");
    messageDiv.textContent = "";

    if (!email) {
        messageDiv.textContent = "Please enter your email address.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/forgotpassword", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
                "content-type": "application/json"
            },
            credentials: "include"
        });
        console.log("Response:", response);
        let result;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            result = await response.json();
            console.log("JSON Response:", result);
        } else {
            result = await response.text();
            console.log("Text Response:", result);
        }
        if (response.ok) {
            messageDiv.textContent = "Password reset link sent to your email.";
            messageDiv.style.color = "green";
        } else {
            messageDiv.textContent = result.message || "Error sending password reset link.";
            messageDiv.style.color = "red";
        }
    } catch (err) {
        messageDiv.textContent = "Network error. Please try again later.";
        messageDiv.style.color = "red";
    }
});