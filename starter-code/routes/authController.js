const express = require('express');
const authController = express.Router()
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// authController.use((req, res, next) => {
//   if (req.session.currentUser === 'undefined') { next(); }
//   else { res.redirect('/'); }
// })

authController.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authController.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.redirect('auth/login', {
      errorMessage: 'Enter username and password to login'
    });
    return;
  }

  User.findOne({ "username": username })
    .exec((err, user) => {
      if (err || !user) {
        res.render('auth/login', {
          errorMessage: 'No user with that name found'
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render('protected/home', {
            name: user.name
          });
        } else {
          // console.log(password, user.password)
          res.render('auth/login', {
            errorMessage: 'Incorrect password'
          });
        };
      };
    });
});

authController.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authController.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  if (username === "" || password === "" || name === "" | email === "") {
    res.redirect('auth/signup', {
      errorMessage: 'Please fill out every field'
    });
    return;
  }

    User.findOne({ "username": username })
      .exec((err, user) => {
        if (user) {
          res.render('auth/signup', {
            errorMessage: 'Username already exists'
          })
        } else {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const newUser = User({
            username: username,
            password: hashPass,
            name: name,
            email: email
          })

          newUser.save((err) => {
            if (err) {
              res.render('auth/signup', {
                errorMessage: 'Something went wrong when signing up'
              });
            } else {
              res.render('protected/home', {
                name: user.name
              });
            };
          });
        };
      });
});

authController.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

// authController.use((req, res, next) => {
//   if (req.session.currentUser) { next(); }
//   else { res.redirect('/login'); }
// })

authController.get('/', (req, res, next) => {
  res.render('protected/home');
});

module.exports = authController;
