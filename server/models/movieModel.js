const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        "name": 
        {
            type: String,
            unique: true,
            require: true
        },
        "director": 
        {
            type: String,
            require: true,
            unique: true
        },
         "releaseDate": 
        {
            type: String,
            require: true
        },
         "length": 
        {
            type: Number,
            require: true
        },
        "picture": 
        {
            type: String,
            require: true
        
        },
        "userId":
        {
            type: String,
            unique: true
        }
    },
    {
        versionKey: false
    }
)

const UserModel = mongoose.model("user", UserSchema, "users");

module.exports = UserModel;