import {sendHTTPRequests, sleepMode} from "./utils/functions.js"
const loginUrl = "http://localhost:3000/auth/login";

let username = document.getElementById("username");
let password = document.getElementById("password");

document.getElementById("loginBtn").addEventListener("click", async()=>
{
    if(username.value == "" || password.value == "")
    {
        alert("Please fill all the fields");
    }
    else
    {
        let loginData = 
        {
            username : username.value,
            password : password.value
        }
        try
        {
            let responseHttp = await sendHTTPRequests(loginUrl, "POST", JSON.stringify(loginData));
            console.log(responseHttp);
            if(responseHttp.status == "success") {
                console.log("Login successful:", responseHttp);
                await sleepMode();
                window.location.href = "./homePage.html";
            } else {
                alert("loginAlert:" + JSON.stringify(responseHttp));
            }
        }
        catch(error)
        {
            alert("loginErrorAlert:" + JSON.stringify(error.message));
        }
    }
})