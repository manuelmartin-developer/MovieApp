const User = require('../models/users_model');
const bcrypt = require("bcryptjs");

checkEmailAndPassword = (req, res, next) => {
    User.findOne({
        email: req.body.email
    })
    .populate("roles", "-__v")
    .exec((err, user) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }

        if (!user) {
            const message = `That email does not exist in our database`;
            const href = "location.href='/'";
            return res.status(404).render('message', {
                message,
                href
            });
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {

            const message = `Invalid password!`;
            const href = "location.href='/'";
            return res.status(404).render('message', {
                message,
                href
            });
        }

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        next();
    });
};
const verifySignIn = {
    checkEmailAndPassword
  };
  
  module.exports = verifySignIn;