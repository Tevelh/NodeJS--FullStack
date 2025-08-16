const jwt = require("jsonwebtoken");


const blockedUsers = new Set();

module.exports = function verifyToken(req, res, next) {
    if (req.session && req.session.blockedUserId && blockedUsers.has(req.session.blockedUserId)) {
        return res.status(403).json({ error: "Access denied due to counter logout" });
    }

    const token = req.session.token;
    console.log("Session in verifyToken:", req.session);
    if (!token) return res.status(401).json({ error: "Token not provided" });
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
        req.user = data;
        if (blockedUsers.has(data.id)) {
            req.session.blockedUserId = data.id;
            return res.status(403).json({ error: "Access denied due to counter logout" });
        }
        next();
    } catch (error) {
        res.send("Error with token verification: " + error.message);
    }
}

module.exports.blockedUsers = blockedUsers;

