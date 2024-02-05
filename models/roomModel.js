const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    memberIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const ROOM = mongoose.model("Room", roomSchema);

module.exports = ROOM;
