const express = require('express');
const profileController = express.Router();
const User = require('../models/user');

profileController.get('/:userId', (req, res, next) => {
  let userId = req.params.userId
  User
    .findOne({ "_id": userId })
    .exec((err, user) => {
        res.render("profiles/show", {
          user,
          session: req.session.currentUser
        });
    });
  });

profileController.get('/:userId/edit', (req, res, next) => {
  const userId = req.params.userId;

  User
    .findOne({ "_id": userId })
    .exec((err, user) => {
      if ( err || !user || !req.session.currentUser ) {
        res.redirect('/login');
        return;
      }

      else if (req.session.currentUser._id == user._id) {
        res.render('profiles/edit', {
          name: user.name,
          email: user.email,
          summary: user.summary,
          imageUrl: user.imageUrl,
          company: user.company,
          jobTitle: user.jobTitle,
          id: user._id
        })
      } else {
        res.redirect(`/profile/${req.session.currentUser._id}`);
        console.log('redirected', req.session.currentUser._id, user._id)
      }
    });
});

profileController.post('/:userId', (req, res, next) => {
  const userId = req.params.userId

  const userUpdate = {
    name: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  }

  User
    .findOneAndUpdate({ "_id": userId }, userUpdate)
    .exec((err) => {
      if (err) {
        res.render(`profile/${userId}/edit`, {
          errorMessage: 'There was a problem updating your profile'
        })
      } else {
        res.redirect(`/profile/${userId}`);
      }
    })
});



module.exports = profileController;
