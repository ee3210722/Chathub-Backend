const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/register' , userController.register);
router.post('/login', userController.login);
router.put('/editUserProfile', authMiddleware.verifyAuth,  upload.single('image'), userController.editUserProfile);
router.get('/getUserData', authMiddleware.verifyAuth, userController.getUserData);

router.get('/logout', authMiddleware.verifyAuth, userController.logout);

module.exports = router;