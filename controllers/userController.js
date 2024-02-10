const USER = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) res.json({ success: false, msg: "Confirm your password again!" });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new USER({
            name,
            email,
            password: passwordHash
        })

        await user.save();
        res.status(200).json({success: true});

    } catch (error) {
        res.status(500).json({success: false,  message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await USER.findOne({ email });
        if (userData) {
            const isSame = await bcrypt.compare(password, userData.password);
            if (isSame) {
                const payload = {userData: userData}
                const authToken = jwt.sign(payload, JWT_SECRET);
                res.json({success: true, authToken: authToken});
            } else {
                res.json({ success: false , msg: "Incorrect password" });
            }
        } else {
            res.json({success: false, msg: "This email is not registered"})
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.json({success: true , msg: "Logged Out successfully!"});
    } catch (error) {
        res.json({success: false , msg: error});
    }
}


module.exports = {
    register,
    login,
    logout,
}

// const loadRegister = async (req, res) => {
//     try {
//         res.render('register', {res});
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// const loadLogin = async (req, res) => {
//     try {
//         res.render('login');
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// const loadDashboard = async (req, res) => {
//     try {
//         let users = await USER.find({_id: {$nin:[req.session.user._id]}})
//         // res.render('dashboard', {user: req.session.user, users:users});
//         res.redirect('http://localhost:3000/');
//     } catch (error) {
//         console.log(error.message);
//     }
// }
