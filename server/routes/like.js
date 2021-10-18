const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//            Likes
//=================================

router.post('/getLikes', (req, res) => {
 //Like 정보가져오기 
 let variable = {}
 if(req.body.videoId) {
     variable = {videoId: req.body.videoId}
 } else {
     variable = {commentId: req.body.commentId}
 }

 Like.find(variable)
  .exec((err, likes) => {
      if(err) res.status(400).json({success: false, err});
      res.status(200).json({success: true, likes})
  })
});

router.post('/getDislikes', (req, res) => {
 //Like 정보가져오기 
 let variable = {}
 if(req.body.videoId) {
     variable = {videoId: req.body.videoId}
 } else {
     variable = {commentId: req.body.commentId}
 }

 Dislike.find(variable)
  .exec((err, dislikes) => {
      if(err) res.status(400).json({success: false, err});
      res.status(200).json({success: true, dislikes})
  })
});

module.exports = router;
