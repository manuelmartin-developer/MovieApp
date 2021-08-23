const passport = require('passport');
let userProfile;
let token;
const GoogleStrategy = require('passport-google-oauth20').Strategy;



const googleauth = passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/login"
    },
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        token = accessToken;
        return done(null, userProfile);
    }
));

const authgoogle = {
    googleauth,
    userProfile,
    token
  };
  module.exports = authgoogle;