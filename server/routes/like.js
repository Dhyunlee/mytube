const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//            Likes & Dislike
//=================================

router.post('/getLikes', (req, res) => {
  //Like 정보가져오기
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  }

  Like.find(variable).exec((err, likes) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, likes });
  });
});

router.post('/getDislikes', (req, res) => {
  //Like 정보가져오기
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, dislikes });
  });
});

router.post('/upLike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId,
    };
  }

  // Like collection에 클릭 정보를 담기
  const like = new Like(variable);

  like.save((err, likeResult) => {
    if (err) res.status(400).json({ success: false, err });

    // 만약, Dislike 이 이미 클릭이 되어있다면 Dislike 을 1 줄여준다.
    Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', (req, res) => {
  console.log('unlike', req.body);
  let variable = {};
  if (req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId,
    };
  }
  // Like 이 이미 클릭이 되어있다면 하나 감소시키기
  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/unDislike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId,
    };
  }

  // Dislike 이 이미 클릭이 되어있다면 하나 감소시키기
  Dislike.findOneAndDelete(variable).exec((err, result) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/upDislike', (req, res) => {
  let variable = {};
  if (req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId,
    };
  }

  // Dislike collection에 클릭 정보를 담기
  const dislike = new Dislike(variable);

  dislike.save((err, DislikeResult) => {
    if (err) res.status(400).json({ success: false, err });

    // 만약, Like 이 이미 클릭이 되어있다면 Like 을 1 줄여준다.
    Like.findOneAndDelete(variable).exec((err, LikeResult) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});
module.exports = router;
