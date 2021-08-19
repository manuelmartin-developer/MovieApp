const User = require('../models/users_model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require('../middlewares/generateToken');

const db = require("../models/index_models");
const Role = db.role;

const users = {
  register: async (req, res) => {
    try {
      const user = await new User({
        name: req.body.name,
        nickname: req.body.nickname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
      });
      if (req.body.roles) {
        Role.find({
            name: {
              $in: req.body.roles
            }
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({
                message: err
              });
              return;
            }

            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).send({
                  message: err
                });
                return;
              }

              const newUser = user.save();
              const message = `Congratulations ${newUser.name}!\\ You are in our team!\
                        Now you can access to your account.`
              const href = "location.href='/'";
              res.status(201).render('message', {
                newUser,
                message,
                href
              });
            });
          }
        );
      } else {
        Role.findOne({
          name: "user"
        }, (err, role) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }

          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({
                message: err
              });
              return;
            }

            const newUser = user.save();
            const message = `Congratulations ${user.name}! You are in our team!
                      Now you can access to your account.`
            const href = "location.href='/'";
            res.status(201).render('message', {
              newUser,
              message,
              href
            });
          });
        });
      }

    } catch (error) {
      res.status(400).json({
        error: error.message
      });

    }
  },
  logout: async (req, res) => {
    try {
      const token = req.cookies.token;
      jwt.sign(token, "", {
        expiresIn: 1
      }, (logout, err) => {
        if (logout) {
          const message = `You have been Logged Out`
          const href = "location.href='/'";
          res.status(201).render('message', {
            message,
            href,
          });
        } else {
          res.send({
            msg: 'Error'
          });
        }
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  signin: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email
      })
      const id = user.id
      const email = user.email

      await generateToken(res, id, email);

      res.status(200).render('welcome', {
        user
      });

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }

  },
  dashboard: async (req, res) => {
  
      try {
        const email = req.body.email
        const user = await User.find({})
                  .where({
                      'email': email
                  })
        res.status(200).render('admindashboard', {
          user
  
        });
      } catch (error) {
        res.status(400).json({
          error: error.message
        });
      }  

  }
}

module.exports = users;