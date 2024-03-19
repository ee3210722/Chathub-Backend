const CHAT = require("../models/chatModel");
const USER = require("../models/userModel");


const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        let isChat = await CHAT.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.userId } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        })
        .populate("users", "name email isOnline")
        .populate("latestMessage");

        isChat = await USER.populate(isChat, {
            path: "latestMessage.sender",
            select: "name email",
        });

        if (isChat.length > 0) {
            return res.send(isChat[0]);
        } else {
            console.log("chat is going to be created")
            const createdChat = await CHAT.create({
                chatName: "one-to-one chat",
                isGroupChat: false,
                users: [req.userId, userId],
            });
            const fullChat = await CHAT.findOne({ _id: createdChat._id })
                .populate("users", "name email isOnline");

            res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

const fetchChats = async (req,res) => {
    try {
        await CHAT.find({ users: { $elemMatch: { $eq: req.userId } } })
            .populate("users", "name email")
            .populate("groupAdmin", "name")
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

const createGroup = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the Fields" });
    }

    const users = req.body.users;
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

        for (const userId of users) {
            const user = await USER.findById(userId);
            if (user) {
                user.groupsJoined.push(groupChat._id);
                await user.save();
            }
        }

        const fullGroupChat = await CHAT.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json({ "data": fullGroupChat });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const fetchAllGroups = async (req,res) => {
    try {
        const user = await USER.findById(req.userId);
        const groupsJoined = user.groupsJoined;
        const allGroups = await CHAT.find({ _id: { $nin: groupsJoined }, isGroupChat: true })
            .populate("groupAdmin", "name");

        return res.status(200).send(allGroups);

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

const deleteGroup = async (req, res) => {
    try {
        const group = await CHAT.findById(req.body.chatId).lean();
        if (!group) return res.status(404).json({ success: false, msg: "Group not found" });

        if (req.userId !== group.groupAdmin.toString()) {
            return res.status(400).json({ success: false, msg: "Only admin can delete the group" });
        }

        const deletedGroup = await CHAT.findByIdAndDelete(group._id);
        if (!deletedGroup) return res.status(404).json({ success: false, msg: "Failed to delete group" });

        await USER.updateMany(
            { _id: { $in: group.users } },
            { $pull: { groupsJoined: group._id } }
        );

        await MESSAGE.deleteMany({ chat: group._id });

        res.status(200).json({ success: true, deletedGroup: deletedGroup, msg: "Group has been deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


// pending
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
const groupExit = async (req, res) => {
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
const addSelfToGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const desiredGroup = await CHAT.findByIdAndUpdate(
            groupId,
            { $push: { users: require.userId } },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!desiredGroup) {
            res.status(404).json({ success: false, msg:"Group Not Found!"})
        }
        res.status(200).json({ success: true, updatedGroupchat:desiredGroup ,msg:`Added to Group: ${desiredGroup.chatName}`});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg:"Internal Server Error!"})
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
    groupExit,
    addSelfToGroup,
    deleteGroup
}