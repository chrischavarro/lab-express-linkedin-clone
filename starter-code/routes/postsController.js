const express = require('express');
const postsController = express.Router();
const Post = require('../models/post');

postsController.get('/posts', (req, res, next) => {
  Post.find({})
    .exec((err, posts) => {
      if (err) {
        console.log('An error occured with showing posts')
      } else {
        res.render('posts/index', { posts })
      }
    })
})

module.exports = postsController;
