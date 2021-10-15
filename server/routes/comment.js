const { response } = require('express');
const express = require('express');
const router = express.Router();

const { Comment } = require('../models/Comment');

//=================================
//            Comment
//=================================
router.post('/saveComment', (req, res) => {
  // 디비에서 댓글 저장하기
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, comment) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, comment });
      });
  });
});

module.exports = router;
