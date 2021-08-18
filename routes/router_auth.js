const router = require('express').Router();
const users = require('../controllers/users');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

