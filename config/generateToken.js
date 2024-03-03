const jwt = require("jsonwebtoken")
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;

const generateToken = (id) => {
    const payload = { userId: id }
    return jwt.sign(payload, JWT_SECRET_TOKEN, { expiresIn: "30d" });
}

module.exports = generateToken;