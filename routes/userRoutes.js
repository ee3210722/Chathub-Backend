const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/auth');

router.route("/register").post(userControllers.register);
router.route("/login").post(userControllers.login);
router.route("/logout").get(authMiddleware.verifyAuth, userControllers.logout);


router.route("/getUserData").get(authMiddleware.verifyAuth, userControllers.getUserData);
router.route("/editUserProfile").put(authMiddleware.verifyAuth, userControllers.editUserProfile);
router.route("/uploadUserImage").post(authMiddleware.verifyAuth, userControllers.uploadUserImage);
router.route("/fetchAllUsers").get(authMiddleware.verifyAuth, userControllers.fetchAllUsers);   // api/user/fetchAllUsers?search=piyush

module.exports = router;