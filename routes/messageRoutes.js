const express = require("express");
router = express.Router();

const messageControllers = require("../controllers/messageControllers");
const authMiddleware = require("../middlewares/auth");

router.route("/:chatId").get(authMiddleware.verifyAuth, messageControllers.allMessages);
router.route("/").post(authMiddleware.verifyAuth, messageControllers.sendMessage);

module.exports = router;