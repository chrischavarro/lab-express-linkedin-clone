const express = require('express');
const profileController = express.Router();
const User = require('../models/user');

profileController.get('/profile/:userId/edit', (req, res, next) => {
  const userId = req.params.userId;

  User
    .find({ _id: userId })
    .exec((err, user) => {
      if (err || !user || req.sessions.currentUser !== user) {
        res.redirect('auth/login', {
          errorMessage: 'You don\'t have permission to edit this profile.'
        });
      } else {
        res.render('profiles/edit', {
          name: user.name,
          email: user.email,
          summary: user.summary,
          imageUrl: user.imageUrl,
          company: user.company,
          jobTitle: user.jobTitle,
          id: user._id
        });
      };
    });
});

profileController.post('/profile/:userId', (req, res, next) => {
  const userId = req.params.userId

  const userUpdate = {
    name: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: user.jobTitle
  }

  User
    .findOneAndUpdate({ "_id": userId }, userUpdate)
    .exec((err) => {
      if (err) {
        res.redirect('profile/:userId/edit', {
          errorMessage: 'There was a problem updating your profile'
        })
      } else {
        res.render('/home');
      }
    })
});

profileController.get('/profile/:userId', (req, res, next) => {
  let userId = req.params.userId

  if (req.session.currentUser._id === userId) {
    res.render('profiles/edit', {
      additionalComponents: 'Edit Button'
    });
    return;
  }

  User
    .findOne({ "_id": userId })
    .exec((err, user) => {
      if (!req.session.currentUser) {
        res.render('profiles/show', {
          name: user.name,
          jobTitle: user.jobTitle,
          imageUrl: user.imageUrl,
          company: user.company
        })
      } else {
        res.render('profiles/show', {
          name: user.name,
          email: user.email,
          summary: user.summary,
          imageUrl: user.imageUrl,
          company: user.company,
          jobTitle: user.jobTitle
        });
      };
    });
});

module.exports = profileController;
