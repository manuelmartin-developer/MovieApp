const express = require('express');
const session = require('express-session');
const passport = require('passport');
const favicon = require('serve-favicon');
require('dotenv').config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const router_home = require('./routes/router_home');
const router_auth = require('./routes/router_auth');
const path = require('path');
const methodOverride = require('method-override');


const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: [
  "http://localhost:process.env.PORT"
    ]
};

app.use("/public", express.static(path.join(__dirname, 'public')));

//View engine
app.set('view engine', 'pug');
app.set('views','./views');

//Middlewares
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET_SESSION 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use('/', router_home);
app.use('/auth', router_auth);

// 404
app.get('*',  (req, res) => {
    res.status(404).send('404')
  });

app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});

 
