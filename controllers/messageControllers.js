const MESSAGE = require("../models/messageModel");
const USER = require("../models/userModel");
const CHAT = require("../models/chatModel");

const allMessages = async (req,res) => {
    try {
        const messages = await MESSAGE.find({chat: req.params.chatId})
            .populate("sender", "name email")
            .populate("receivers")
            .populate("chat")
            .sort({ updatedAt: -1 })

        res.status(200).send(messages);
    } catch (error) {
        console.log("error");
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}

const sendMessage = async (req,res) => {
    let { chatId, content } = req.body;
    if (!chatId || !content) {
        res.status(400).json({success:false, msg:"Invalid Data is passed into Request"})
    }
    try {
        let newMessage = await MESSAGE.create({
            sender: req.userId,
            chat: chatId,
            content: content
        })
        const onGoingChat = await CHAT.findByIdAndUpdate(chatId, { latestMessage: newMessage });

        newMessage = await MESSAGE.populate(newMessage, [
            { path: "sender", select: "name" },
            { path: "chat" },
            { path: "receivers" }
        ]);
        const updatedChat = await CHAT.populate(onGoingChat, { path: "users", select: "name email" });
        
        res.status(200).json({ success: true, sendedMessage: newMessage, onGoingChat: updatedChat, msg: "message send successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }

}

module.exports = {
    allMessages,
    sendMessage
}