const router = require("express").Router();
const authBL = require("../BLs/authBL");

router.post("/register", async (req, res) => {
    const registerData = req.body;
    const response = await authBL.registerUser(registerData);

    if (response.data) {
        req.session.token = response.data;
        req.session.save(() => {
            res.cookie("token", response.data, {
                httpOnly: true,
                secure: false,
                sameSite: "none",
                maxAge: 3 * 60 * 60 * 1000 
            });
            res.send(response);
        });
    } else {
        res.send(response);
    }
});

router.post("/login", async (req, res) => {
    const loginData = req.body;
    const response = await authBL.loginUser(loginData);

    if (response.data) {
        req.session.token = response.data;
        console.log("User logged in:", req.session.token);
        req.session.save(() => {
            res.cookie("token", req.session.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 3 * 60 * 60 * 1000
            });
            console.log("Session after login:", req.session); 
            res.send(response);
        });
    } else {
        res.send(response);
    }
});



router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.clearCookie("token");
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;