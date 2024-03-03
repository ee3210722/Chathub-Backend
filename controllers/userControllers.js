const USER = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../config/generateToken');



const register = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        const userExist = await USER.findOne( { email });
        if (userExist) res.json({ success: false, msg: "User already Exists" })

        const user = new USER({
            name: name,
            email: email,
            password: password
        })
        await user.save();
        res.status(200).json({success: true, msg:"Account is created successfully !"});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,  message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await USER.findOne({ email });
        if (userData) {
            const isSame = await userData.matchPassword(password);
            if (isSame) {
                const authToken = generateToken(userData._id);
                res.status(200).json({success: true, authToken: authToken, msg: "Logged in succesfully!"});
            } else {
                res.status(400).json({ success: false , msg: "Incorrect password" });
            }
        } else {
            res.status(400).json({ success: false, msg: "This email is not registered" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.status(200).json({success: true , msg: "Logged Out successfully!"});
    } catch (error) {
        res.status(500).json({success: false , msg: error});
    }
}



const getUserData = async (req, res) => {
    try {
        const userData = await USER.findById(req.userId);
        res.status(200).json({ success: true, userData: userData , msg: "User profile data is fetched successfully" });

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

const editUserProfile = async (req, res) => {
    try {
        const { name, dateOfBirth, age, occupation, bio } = req.body;
        const userData = await USER.findById(req.userId);

        const updatedUserFields = {
            name: name === "" ? userData.name : name,
            date_of_birth: dateOfBirth === "" ? userData.date_of_birth : dateOfBirth,
            age: age === "" ? userData.age : age,
            occupation: occupation === "" ? userData.occupation : occupation,
            bio: bio === "" ? userData.bio : bio
        };

        // If an image is present in the request, add it to the updatedUserFields
        if (req.file) {
            updatedUserFields.image = req.file.buffer;
        }

        const updatedUser = await USER.findByIdAndUpdate(
            userData._id,
            {
                $set: updatedUserFields
            },
            { new: true }
        );

        res.status(200).json({ success: true, msg: "User profile updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

const fetchAllUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await USER.find(keyword).find({ _id: { $ne: req.userId } });
    res.send(users);
}



module.exports = {
    register,
    login,
    editUserProfile,
    getUserData,
    logout,
    fetchAllUsers,
}

