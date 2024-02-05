const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, callback) {
        const name = Date.now() + '-' + file.originalname;
        callback(null, name);
    }
})
const upload = multer({ storage: storage });


const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', upload.single('image'), userController.register);
router.post('/login', userController.login);

router.get('/logout', authMiddleware.verifyAuth, userController.logout);


// router.get('*', (req,res) => { res.redirect('/login') });
// router.get('/register', authMiddleware.isLoggedOut ,userController.loadRegister);
// router.get('/login', authMiddleware.isLoggedOut ,userController.loadLogin);
// router.get('/dashboard', authMiddleware.isLoggedIn ,userController.loadDashboard);
module.exports = router;