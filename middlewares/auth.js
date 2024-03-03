const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
            req.userId = payload.userId;
            next();
        }catch(error) {
            res.status(401).json({success: false, msg: "Not Authorized, token failed" });
        }
    } else {
        res.status(401).json({ success: false, msg: "Not Authorized, no token" });
    }
}

module.exports = {
    verifyAuth,
}