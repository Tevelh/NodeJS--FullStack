const express = require("express");
const authRouter = require("./routers/authRouter");
const usersRouter = require("./routers/usersRouter");
const moviesRouter = require("./routers/moviesRouter");
const forgotPasswordRouter = require("./routers/forgotPasswordRouter");
const app = express();
const MongoStore = require('connect-mongo');
const session = require("express-session");
const sessionLogModel = require("./models/sessionLogModel");


require("dotenv").config();
require("./configs/connectToDB")();

app.use(express.json());
const cors = require("cors");
app.use(cors({
     origin: "http://localhost:5501",
    credentials: true
}));


app.use(session({
    secret: process.env.SECRET_KEY_TOKEN,
    resave: false,
    saveUninitialized: false,
    name: "myCookie",
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
        secure: false
    },
    rolling: true,
    store: MongoStore.create({
       mongoUrl: process.env.DB_CONNECTION_STRING
    })
}));

app.use(async (req, res, next) => {
    try {
        if (req.session.user && req.session.user.userId) {
            await sessionLogModel.create({
                userId: req.session.user.userId
            });
        }
    } catch (error) {
        console.error("Error logging session:", error);
    } finally {
        next();
    }
});
app.get("/", (req, res)=>
{
    console.log("Server is online");
})

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/forgotpassword", forgotPasswordRouter);


app.listen(process.env.PORT, ()=>
{
    console.log("Server is running");
})

