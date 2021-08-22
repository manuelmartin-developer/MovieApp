const router = require('express').Router();
const users = require('../controllers/users');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

//User-Admin
router.get('/dashboard',verifyToken, isAdmin, users.dashboard);
router.post('/logout',verifyToken, users.logout);

//User
router.get('/search:title?',verifyToken, users.search);
router.post('/search:imdbID?',verifyToken, users.searchDetails);
router.post('/movies',verifyToken, users.addMyMovies);
router.delete('/movies',verifyToken, users.deleteMyMovies);
router.get('/movies',verifyToken, users.movies);

//Admin
router.get('/createMovie',verifyToken, isAdmin, users.createMovie);
router.post('/createMovie',verifyToken, isAdmin, users.addMovie);
router.get('/editMovie',verifyToken, isAdmin, users.editMovie);
router.put('/editMovie/:id',verifyToken, isAdmin, users.editedMovie);
router.get('/removeMovie',verifyToken, isAdmin, users.deleteMovie);
router.delete('/removeMovie',verifyToken, isAdmin, users.deletedMovie);

module.exports = router;
