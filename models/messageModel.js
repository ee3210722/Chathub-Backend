const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamp: true,
});

const MESSAGE = mongoose.model("Message", messageSchema);

module.exports = MESSAGE;
