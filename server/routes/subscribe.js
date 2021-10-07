const { response } = require('express');
const express = require('express');
const router = express.Router();

const { Subscriber } = require('../models/Subscriber');

//=================================
//            Subscribe
//=================================
router.post('/subscribeNumber', (req, res) => {
  // 디비에서 비디오 데이터 가져오기
  Subscriber.find({ 'userTo': req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, subscribeNumber: subscribe.length });
  });
});

router.post('/subscribed', (req, res) => {
  // 디비에서 비디오 데이터 가져오기
  Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
   .exec((err, subscribed) => {
      if(err) return res.status(400).join({success: false, err});
      let result = false;
      if(subscribed.length !== 0) {
        result = true;
      }
      res.status(200).json({success: true, subscribed: result})
   })
});

// 구독 취소하기
router.post('/unSubscribe', (req, res) => {
  Subscriber.findOneAndDelete({userTo: req.body.userTo, userFrom: req.body.userFrom})
   .exec((err, doc) => {
     if(err) return res.status(400).json({success: false, err})
     res.status(200).json({success: true, doc})
   })
});

// 구독하기
router.post('/subscribe', (req, res) => {
   const subscribe = new Subscriber(req.body);

   subscribe.save((err, doc) => {
     if(err) return res.json({success: false, err});
     return res.status(200).json({success: true})
   })
});

module.exports = router;
