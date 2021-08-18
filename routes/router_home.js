const router = require('express').Router();
const home = require('../controllers/home');
const users = require('../controllers/users');
const {checkDuplicateEmailOrNickname, checkRolesExisted} = require('../middlewares/verifySignUp');
const {checkEmailAndPassword} = require('../middlewares/verifySignIn');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

//Home
router.get('', home.home);
router.get('/signup', home.signup);
router.post('/signup', checkDuplicateEmailOrNickname, checkRolesExisted, users.register);
router.post('/login',checkEmailAndPassword, verifyToken, isAdmin, home.login);


// router.post('/logout', home.logout);

module.exports = router;
