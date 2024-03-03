const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/auth');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.route("/register").post(userControllers.register);
router.route("/login").post(userControllers.login);
router.route("/logout").get(authMiddleware.verifyAuth, userControllers.logout);


router.route("/getUserData").get(authMiddleware.verifyAuth, userControllers.getUserData);
router.route("/editUserProfile").put(authMiddleware.verifyAuth, upload.single('image'), userControllers.editUserProfile);
// api/user/fetchAllUsers?search=piyush
router.route("/fetchAllUsers").get(authMiddleware.verifyAuth, userControllers.fetchAllUsers);

module.exports = router;