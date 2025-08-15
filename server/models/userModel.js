const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        "username": 
        {
            type: String,
            unique: true,
            require: true
        },
        "email": 
        {
            type: String,
            require: true,
            unique: true
        },
         "age": 
        {
            type: Number,
            require: true
        },
         "password": 
        {
            type: String,
            require: true
        },
        "firstName": 
        {
            type: String,
            require: true
        },
        "lastName": 
        {
            type: String,
            require: true
        },
        "address":
        {
            "street":
            {
                type: String,
                require: false
            },
            "city":
            {
                type: String,
                require: false
            }
        }
    },
    {
        versionKey: false
    }
)

const UserModel = mongoose.model("user", UserSchema, "users");

module.exports = UserModel;