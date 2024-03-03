const CHAT = require("../models/chatModel");
const USER = require("../models/userModel");


const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            console.log("UserID param not sent with request");
            return res.sendStatus(400);
        }

        let isChat = await CHAT.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.userId } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        })
        .populate("users", "-password")
        .populate("latestMessage");

        isChat = await USER.populate(isChat, {
            path: "latestMessage.sender",
            select: "name email",
        });

        if (isChat.length > 0) {
            return res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.userId, userId],
            };

            const createdChat = await CHAT.create(chatData);
            const fullChat = await CHAT.findOne({ _id: createdChat._id })
                .populate("users", "-password");
            res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

const fetchChats = async (req,res) => {
    try {
        await CHAT.find({ users: { $elemMatch: { $eq: req.userId } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await USER.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email"
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const createGroup = async (req,res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the Fields" });
    }

    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group")
    }

    users.push(req.userId);

    try {
        const groupChat = await CHAT.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.userId,
        });
        const fullGroupChat = await CHAT.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);

    } catch(error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const renameGroup = async (req, res) => {
    try {
        const { groupId, chatName } = req.body;
        const groupChat = await CHAT.findOne({ _id: groupId });

        if (groupChat.groupAdmin != req.userId) {
            return res.status(400).send("Only GroupAdmin can rename the group");
        }

        groupChat.chatName = chatName;
        const updatedGroupChat = await groupChat.save();

        return res.status(200).send(updatedGroupChat);

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const removeFromGroup = async (req, res) => {
    try {
        const { groupId, groupMemberId } = req.body;

        const groupChat = await CHAT.findOne({ _id: groupId });

        if (groupChat.groupAdmin != req.userId) {
            return res.status(400).send("Only GroupAdmin can remove the other group members");
        }

        const updatedGroupChat = await CHAT.findByIdAndUpdate(
            groupId,
            { $pull: { users: groupMemberId } },
            { new: true }
        );

        res.status(200).send(updatedGroupChat);

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const addToGroup = async (req, res) => {
    try {
        const { groupId, groupMemberId } = req.body;

        const groupChat = await CHAT.findOne({ _id: groupId });

        if (groupChat.groupAdmin != req.userId) {
            return res.status(400).send("Only GroupAdmin can add other group members");
        }

        groupChat.users.push(groupMemberId);
        const updatedGroupChat = await groupChat.save();

        res.status(200).send(updatedGroupChat);

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const fetchAllGroups = async (req,res) => {
    try {
        const allGroups = await CHAT.find({ isGroupChat: true })
            .populate("groupAdmin", "-password");

        return res.status(200).send(allGroups);
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const groupExit = async (req,res) => {
    try {
        const { groupId } = req.body;

        const updatedGroupChat = await CHAT.findByIdAndUpdate(
            groupId,
            { $pull: { users: req.userId } },
            { new: true }
        ).populate("users", "-password");

        res.status(200).send(updatedGroupChat);

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}



module.exports = {
    accessChat,
    fetchChats,
    createGroup,
    renameGroup,
    removeFromGroup,
    addToGroup,
    fetchAllGroups,
    groupExit
}