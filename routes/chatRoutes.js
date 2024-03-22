const express = require("express");
const router = express.Router();

const chatControllers = require("../controllers/chatControllers");
const authMiddleware = require("../middlewares/auth");

router.route("/accessUserChat").post(authMiddleware.verifyAuth, chatControllers.accessChatOfUser);
router.route("/accessGroupChat").post(authMiddleware.verifyAuth, chatControllers.accessChatOfGroup);
router.route("/fetchUserChats").get(authMiddleware.verifyAuth, chatControllers.fetchUserChats);
router.route("/createGroup").post(authMiddleware.verifyAuth, chatControllers.createGroup);
router.route("/renameGroup").put(authMiddleware.verifyAuth, chatControllers.renameGroup);
router.route("/removeFromGroup").put(authMiddleware.verifyAuth, chatControllers.removeFromGroup);
router.route("/addToGroup").put(authMiddleware.verifyAuth, chatControllers.addToGroup);
router.route("/fetchAllGroups").get(authMiddleware.verifyAuth, chatControllers.fetchAllGroups);
router.route("/groupExit").get(authMiddleware.verifyAuth, chatControllers.groupExit);
router.route("/addSelfToGroup").put(authMiddleware.verifyAuth, chatControllers.addSelfToGroup);
router.route("/deleteGroup").delete(authMiddleware.verifyAuth, chatControllers.deleteGroup);

module.exports = router;