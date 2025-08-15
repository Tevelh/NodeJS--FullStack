import { sendHTTPRequests, sleepMode} from "./utils/functions.js";
const registerUrl = "http://localhost:3000/auth/register";

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let age = document.getElementById("age");
let email = document.getElementById("email");
let username = document.getElementById("username");
let password = document.getElementById("password");
let city = document.getElementById("city");
let street = document.getElementById("street");

document.getElementById("registerBtn").addEventListener("click", async()=>
{
    if(firstName.value == "" || lastName.value == "" || age.value == "" || email.value == "" || username.value == "" || password.value == "" || city.value == "" || street.value == "")
    {
        alert("Please fill all the fields");
    }
    else
    {
        let newUser = 
        {
            firstName: firstName.value,
            lastName : lastName.value,
            age : age.value,
            email : email.value,
            username : username.value,
            password : password.value,
            address:
            {
                city : city.value,
                street : street.value
            }
        }
        try
        {
            let response = await sendHTTPRequests(registerUrl, "POST", JSON.stringify(newUser));
            console.log(response);
            await sleepMode();
            if(response == "New User Created") {
                console.log("Register successful:", response);
                await sleepMode();
                window.location.href = "./homePage.html";
            } else {
                alert(response);
            }
        }
        catch(error)
        {
            alert(error.message);
        }
    }

})