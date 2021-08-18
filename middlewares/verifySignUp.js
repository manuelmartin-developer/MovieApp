const db = require("../models/index_models");
const ROLE = db.ROLES;
const User = require('../models/users_model');


checkDuplicateEmailOrNickname = (req, res, next) => {
      // Email
      User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (user) {
          const message = `This email is already in use`;
          const href = "location.href='/signup'";
          res.status(400).render('message', {
          message,
          href
      });
          return;
        }
         // Nickname
    User.findOne({
      nickname: req.body.nickname
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (user) {
          const message = `This nickname is already in use`;
          const href = "location.href='/signup'";
          res.status(400).render('message', {
          message,
          href
      });
        return;
      }
        next();
      });
    });
  };
  
  checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLE.includes(req.body.roles[i])) {
          res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }

    }
    next();
  };
  
  const verifySignUp = {
    checkDuplicateEmailOrNickname,
    checkRolesExisted
  };
  
  module.exports = verifySignUp;