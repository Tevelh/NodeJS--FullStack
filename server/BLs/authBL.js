const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async(registerData)=>
{
    try
    {
        registerData.password = await bcrypt.hash(registerData.password, 10);
        try
        {
            const {email, username} = registerData;
            const existUserEmail = await UserModel.findOne({email});
            const existUserUsername = await UserModel.findOne({username});
            if(existUserEmail)
            {
                return "Email already exists";
            }
            else if(existUserUsername)
            {
                return "Username already exists";
            }
            let newUser = new UserModel(registerData);
            await newUser.save();
            return "New User Created";
        }
        catch(error)
        {
            return "Can't create a user " +error.message;
        }
    }
    catch(error)
    {
        return "Can't encryption password " + error.message;
    }
}

const loginUser = async(loginData)=>
{
    let {username, password} = loginData;
    try
    {
        let user = await UserModel.findOne({username});
        if(user)
        {
            let compareResponse = await bcrypt.compare(password, user.password);
            if(compareResponse)
            {
                try
                {
                    let token = jwt.sign(
                        {
                            username : user.username,
                            id : user._id,
                            email: user.email
                        },
                        process.env.SECRET_KEY_TOKEN,
                        {
                            expiresIn : "3h"
                        }
                    )
                    return {
                        status : "success",
                        data : token
                    }
                }
                catch(error)
                {
                    return "Error with token creation "+ error.message;
                }
            }
            else
            {
                return "Invalid password";
            }
        }
        else
        {
            return "User not found, please try again";
        }
    }
    catch(error)
    {
        return "Can't find user : "+ error.message;
    }
}


module.exports =
{
    registerUser,
    loginUser
}