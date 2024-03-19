const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    groupsJoined: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    image: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    occupation: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true}
)

userSchema.methods.matchPassword = async function (enteredPasssword) {
    return await bcrypt.compare(enteredPasssword, this.password);
}

const USER = mongoose.model('User', userSchema);
module.exports = USER;
