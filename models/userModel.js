const mongoose = require("mongoose");

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
    image: {
        type: Buffer,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    rooms_joined: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    date_of_birth: {
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
    is_online: {
        type: Boolean,
        default: false
    }
},
{timestamps:true}
)

const USER = mongoose.model('User', userSchema);

module.exports = USER;