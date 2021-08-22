const router = require('express').Router();
const home = require('../controllers/home');
const users = require('../controllers/users');
const {checkDuplicateEmailOrNickname, checkRolesExisted} = require('../middlewares/verifySignUp');
const {checkEmailAndPassword} = require('../middlewares/verifySignIn');

//Home
router.get('', home.home);
router.get('/signup', home.signup);
router.post('/signup', checkDuplicateEmailOrNickname, checkRolesExisted, users.register);
router.post('/login',checkEmailAndPassword, users.signin);


module.exports = router;
