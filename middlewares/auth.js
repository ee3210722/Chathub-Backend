const jwt = require('jsonwebtoken');
const JWT_SECRET = '%harshitgupta%';

const verifyAuth = (req, res, next) => {
    const token = req.header('authToken');
    if (!token) res.status(401).json({success: false, msg: "AuthToken is Required" });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userData = payload.userData;
        next();
    } catch(error) {
        res.status(401).json({success: false, msg: "Please authenticate using a valid token" });
    }
}


// const isLoggedIn = (req, res, next) => {
//     try {
//         if (!req.session.user) res.json({success: false, msg: "User is not Logged in!"});
//         else next();
//     } catch(error) {
//         res.json({success:false , msg: "Some middleware problem"});
//     }
// }

// const isLoggedOut = (req, res, next) => {
//     try {
//         if (req.session.user) res.redirect('/dashboard');
//         next();
//     } catch(error) {
//         console.log(error.message);
//     }
// }

module.exports = {
    verifyAuth,
}