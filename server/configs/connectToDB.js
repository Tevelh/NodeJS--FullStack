const connectDB = async()=>
{
    try
    {
        await require("mongoose").connect(process.env.DB_CONNECTION_STRING);
        console.log("DB connected");
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports = connectDB;
