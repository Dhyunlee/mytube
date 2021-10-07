const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

//=================================
//            Video
//=================================

// STORAGE MULTER CONFIG
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('Only mp4 is allowed'), false);
    }
  },
});

const upload = multer({ storage: storage }).single('file');

// 클라이언트에서 받은 비디오를 저장
router.post('/uploadfiles', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

// 썸네일 생성하고 비디오 러닝타임도 가져오기
router.post('/thumbnail', (req, res) => {
  let filePath = '';
  let fileDuration = '';

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    console.dir(metadata); //all metadata
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.filePath)
    .on('filenames', function (filenames) {
      // video thumbnail filenames
      console.log('Will generate ' + filenames.join(', '));
      console.log(filenames);

      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      // 썸네일이 생성된 이후의 처리..
      console.log('Screenshots taken');
      return res.json({
        success: true,
        filePath: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png',
    });
});

// 클라이언트에서 받은 비디오 정보들을 저장
router.post('/uploadVideo', (req, res) => {
  // 비디오 정보를 디비에 저장

  const video = new Video(req.body);
  // Video 모델 인스턴스에 비디오 업로드 정보 담기

  video.save((err, doc) => {
    // video에 담은 정보를 디비에 저장
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

// 디비에서 비디오 데이터 가져와서 클라이언트에 전송
router.get('/getVideos', (req, res) => {
     // 디비에서 비디오 데이터 가져오기
     Video.find()
      .populate('writer')
      .exec((err, videos) => {
        if(err) return res.status(400).json({success: false, err});
        res.status(200).json({success: true, videos})
      })
});

// 해당 비디오에 맞는 정보 클라이언트로 전송
router.post('/getVideoDetail', (req, res) => {
  Video.findOne( { "_id": req.body.videoId })
   .populate('writer')
   .exec((err, videoDetail) => {
     if(err) return res.status(400).json( {success: false, err} );
     return res.status(200).json({success: true, videoDetail})
   })
});




module.exports = router;
