const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../configs/sendEmail");
const bcrypt = require("bcrypt");

const getAllUsers = async()=>
{
    try
    {
        const users = await UserModel.find({});
        return users;
    }
    catch(error)
    {
        return error.message;
    }
}

const getUserById = async(userId)=>
{
    try
    {
        let user = await UserModel.findOne({_id: userId});
        console.log(user);
        return user || "User not found";
    }
    catch(error)
    {
        return "Error with finding user " + error.message;
    }
}

const updateUser = async(userData, userId)=>
{
    try
    {
        if(userData.password)
        {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        await UserModel.findByIdAndUpdate(userId, userData);
        return "User updated";
    }
    catch(error)
    {
        return "Error with updating user " + error.message;
    }
}

const deleteUser = async(userId)=>
{
    try
    {
        await UserModel.findByIdAndDelete(userId);
        return "User Deleted";
    }
    catch(error)
    {
        return "Can't delete user " + error.message;
    }
}

const updateUserPassword = async(newPassword, email)=>
{
    try
    {
        let user = await UserModel.findOne({email});
        if(user)
        {
            try
            {
                user.password = await bcrypt.hash(newPassword, 10);
                await UserModel.findByIdAndUpdate(user._id, {password : user.password});
                return "User Password Updated";
            }
            catch(error)
            {
                return "Can't change the password : " + error.message;
            }
        }
        else
        {
            return "User not found";
        }
    }
    catch(error)
    {
        return error.message;
    }
}

const forgotPassword = async(email)=>
{
    try
    {
        let user = await UserModel.findOne({email});
        if(user)
        {
            let tempToken = jwt.sign(
                {
                    email
                },
                process.env.SECRET_KEY_TOKEN,
                {
                    expiresIn: "3h"
                }
            )
            await sendEmail(
                user.email,
                "Reset Password",
                `<a href="http://localhost:5501/client/pages/forgotPasswordResetLink.html?token=${tempToken}">Please click here to reset your password</a>`
            )
            return "Email for reset password sent to Email adress";

        }
        else
        {
            return "User not found";
        }
    }
    catch(error)
    {
        return error.message;
    }
}


module.exports = 
{
    getAllUsers,
    getUserById, 
    updateUserPassword,
    updateUser,
    forgotPassword,
    deleteUser
}