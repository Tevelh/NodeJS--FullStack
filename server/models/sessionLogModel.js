const mongoose = require("mongoose");

const SessionLogSchema = new mongoose.Schema(
{
    "userId" : { type: mongoose.Types.ObjectId, ref : "User"},
    "token" : {type: String, required: true}
}, {
    versionKey: false
})

const SessionLogModel = mongoose.model("sessionLog", SessionLogSchema, "sessions");

module.exports = SessionLogModel;