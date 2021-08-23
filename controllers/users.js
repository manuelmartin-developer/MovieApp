const movies = require("../utils/movies");
const User = require('../models/users_model');
const Movies = require('../models/movie_model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const googleauth = require('../middlewares/authgoogle');
const generateToken = require('../middlewares/generateToken');
const config = require("../config/auth_config");
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
        expires: 1
      }, (logout, err) => {
        if (logout) {
          res.cookie('token', token, {
            expires: new Date(Date.now()),
            secure: false,
            httpOnly: true,
          });
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

    if(req.query.code){
      try {
        const user = req.user;
        const id = user.id;
        const email = user.emails[0].value;
        await generateToken(res, id, email);
  
        res.status(200).render('guestdashboard');
      } catch (error) {
        res.status(400).json({
          error: error.message
        });
      }
    }else{

      try {
        const user = await User.findOne({
          email: req.body.email
        })
        const id = user.id;
        const email = user.email;
  
        await generateToken(res, id, email);
  
        res.status(200).render('welcome', {
          user
        });
  
      } catch (error) {
        res.status(400).json({
          error: error.message
        });
      }
    }

  },
  dashboard: async (req, res) => {
    try {
      const movies = await Movies.find();
      res.status(200).render('admindashboard', {
        movies
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }

  },
  search: async (req, res) => {
    try {

      const title = await req.query.title;
      let films = await movies.getMovies(title);
      const notFound = "Movie not found :("
      let lengthMovies;
      if (!films.Error) {

        if (films.Search) {
          lengthMovies = Number(films.totalResults);
        } else {
          lengthMovies = Number(films[0].totalResults);
        }
      } else {
        films = await Movies.findOne({
          Title: title
        })
      }
      res.status(200).render("searchmovie", {
        title,
        films,
        lengthMovies,
        notFound
      })
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }

  },
  searchDetails: async (req, res) => {

    try {

      const title = await req.body.Title;
      const film = await movies.getOneMovie(title);
      res.status(200).render("onemovie", {
        film
      })
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }

  },
  movies: async (req, res) => {

    try {
      const token = await req.cookies.token;
      let userID;
      if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            const message = `Invalid Token`;
            const href = "location.href='/'";
            return res.status(401).render('message', {
              message,
              href
            });
          } else {
            userID = decoded.id;
          };
        });
      };
      const user = await User.findById({
        _id: userID
      });
      const moviesTitles = user.mymovies;
      const mymovies = [];
      for (let title of moviesTitles) {
        const movie = await movies.getOneMovie(title);
        mymovies.push(movie);
      }
      res.status(200).render("mymovies", {
        mymovies
      });

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  addMyMovies: async (req, res) => {

    try {

      const title = await req.body.Title;
      const token = await req.cookies.token;
      let userID;
      if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            const message = `Invalid Token`;
            const href = "location.href='/'";
            return res.status(401).render('message', {
              message,
              href
            });
          } else {
            userID = decoded.id;
          };
        });
      };
      const user = await User.findById({
        _id: userID
      });

      if (user.mymovies.includes(title)) {

        const message = `Movie is already in your favorites`;
        const href = "window.history.back()";
        res.status(200).render('message', {
          message,
          href
        });

      } else {

        await User.findByIdAndUpdate({
          _id: userID
        }, {
          $push: {
            mymovies: title
          }
        });

        const message = `Movie has added to your favorites`;
        const href = "window.history.back()";
        res.status(201).render('message', {
          message,
          href
        });
      }
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }



  },
  deleteMyMovies: async (req, res) => {

    try {

      const title = await req.body.Title;
      const token = await req.cookies.token;
      let userID;
      if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            const message = `Invalid Token`;
            const href = "location.href='/'";
            return res.status(401).render('message', {
              message,
              href
            });
          } else {
            userID = decoded.id;
          };
        });
      };
      const user = await User.findById({
        _id: userID
      });

      await User.findByIdAndUpdate({
        _id: userID
      }, {
        $pull: {
          mymovies: title
        }
      });

      const message = `Movie has deleted to your favorites`;
      const href = "location.href='/auth/movies'";
      res.status(201).render('message', {
        message,
        href
      });

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }



  },
  createMovie: async (req, res) => {

    res.status(200).render("createmovie");
  },
  addMovie: async (req, res) => {
    const movie = await new Movies({
      Title: req.body.Title,
      Year: req.body.Year,
      Director: req.body.Director,
      Poster: req.body.Poster,
      Plot: req.body.Plot
    });

    movie.save(err => {
      if (err) {
        res.status(500).send({
          message: err
        });
        return;
      }

      const newMovie = movie.save();
      const message = 'Movie has been added to db';
      const href = "location.href='/auth/dashboard'";
      res.status(201).render('message', {
        newMovie,
        message,
        href
      });
    });

  },
  editMovie: async (req, res) => {

    try {

      const title = await req.query.Title;
      const movieEdit = await Movies.findOne({
        Title: title
      });
      res.status(200).render("editmovie", {
        movieEdit
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  editedMovie: async (req, res) => {
    try {

      const movieID = await req.params.id;
      const data = await req.body;
      const editedMovie = await Movies.findOneAndUpdate({
        _id: movieID
      }, data);

      const message = "Movie has been updated";
      const href = "location.href='/auth/dashboard'";
      res.status(201).render('message', {
        editedMovie,
        message,
        href
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },
  deleteMovie: async (req, res) => {
    const title = await req.query.Title;
    const movieDelete = await Movies.findOne({
      Title: title
    });
    res.status(200).render("confirm", {
      movieDelete
    });
  },
  deletedMovie: async (req, res) => {
    const movieID = req.body._id
    const deletedMovie = await Movies.findOneAndDelete({
      _id: movieID
    })
    const message = "Movie has been deleted";
    const href = "location.href='/auth/dashboard'";
    res.status(201).render('message', {
      message,
      href
    });
  }


}

module.exports = users;