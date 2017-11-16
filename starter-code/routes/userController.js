const express = require('express');
const userController = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

// userController.use((req, res, next) => {
//   if (req.session.currentUser !== 'undefined') { next(); }
//   else { res.redirect('/login'); }
// });

userController.get('/:userId/posts/new', (req, res, next) => {
  const userId = req.params.userId;
  res.render('posts/new', { userId })
});

userController.post('/:userId/posts', (req, res, next) => {
  const userId = req.params.userId;

  const newPost = Post({
    content: req.body.content,
    _creator: userId
  })

  newPost.save((err) => {
    if (err) {
      res.render('posts/new')
      console.log('An error occured')
    } else {
      res.redirect(`/profile/${userId}`)
      console.log('worked')
    }
  });
});

module.exports = userController;
