const router = require('express').Router();
const home = require('../controllers/home');
const users = require('../controllers/users');
const {checkDuplicateEmailOrNickname, checkRolesExisted} = require('../middlewares/verifySignUp');
const {checkEmailAndPassword} = require('../middlewares/verifySignIn');
const passport = require('passport');
require('../middlewares/authgoogle');

//Home
router.get('', home.home);
router.get('/signup', home.signup);
router.post('/signup', checkDuplicateEmailOrNickname, checkRolesExisted, users.register);
router.post('/login',checkEmailAndPassword, users.signin);
router.get('/login',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }), users.signin);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000'
    }),
    (req, res) => {
        res.redirect('http://localhost:3000/auth/dashboard');
    });


module.exports = router;
