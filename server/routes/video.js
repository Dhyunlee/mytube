const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
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

module.exports = router;
