const router = require("express").Router();
const usersBL = require("../BLs/usersBL");
router.post("/", async(req, res)=>
{
    let {email} = req.body;
    let response = await usersBL.forgotPassword(email);
    res.send(response);
})

router.post("/reset", async (req, res) => {
    const { token, newPassword } = req.body;
    const jwt = require("jsonwebtoken");
    const UserModel = require("../models/userModel");
    const bcrypt = require("bcrypt");
    try {
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Missing token or new password." });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
        const user = await UserModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.json({ success: true, message: "Password reset successfully." });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;