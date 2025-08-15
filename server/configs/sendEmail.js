require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html)=>
{
    const transporter = nodemailer.createTransport(
        {
            service : "gmail",
            auth: {
                user : process.env.EMAIL_USER_NAME,
                pass : process.env.USER_PASSWORD
            }
        }
    )
    
    const mailOptions = 
    {
        from: process.env.EMAIL_USER_NAME,
        to,
        subject,
        html : html? html : ""
    }

    transporter.sendMail(mailOptions, (error, info)=>
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log("Mail sent succesfully");
        }
    })
}

module.exports = sendEmail;