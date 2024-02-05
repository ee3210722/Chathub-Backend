const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        ref: 'User'
    }
},
{timestamps:true}
)

const CHAT = mongoose.model('Chat', chatSchema);

module.exports = CHAT;