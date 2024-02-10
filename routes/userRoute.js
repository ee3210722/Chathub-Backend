const express = require('express');
const router = express.Router();

// const path = require('path');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', upload.single('image'), userController.register);
router.post('/login', userController.login);

router.get('/logout', authMiddleware.verifyAuth, userController.logout);

module.exports = router;