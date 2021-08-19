const router = require('express').Router();
const users = require('../controllers/users');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.post('/dashboard',verifyToken, isAdmin, users.dashboard);
router.post('/logout',verifyToken, users.logout);

module.exports = router;
