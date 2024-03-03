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
    rooms_joined: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    image: {
        type: Buffer,
        default: null
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

// The userSchema.pre("save") middleware will be triggered before saving the user data into the database.
userSchema.pre("save", async function (next) {
    if (!this.isModified()) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPasssword) {
    return await bcrypt.compare(enteredPasssword, this.password);
}

const USER = mongoose.model('User', userSchema);
module.exports = USER;
