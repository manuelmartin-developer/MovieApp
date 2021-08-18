const router = require('express').Router();
const home = require('../controllers/home');

//Home
router.get('', home.home);
router.post('/login', home.login);
router.post('/logout', home.logout);

module.exports = router;
