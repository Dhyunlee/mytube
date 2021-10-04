// 변경사항 없음
const express = require('express');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

//클라이언트에서 전송된 데이터 저장하기 위해
//데이터베이스 가져오기
const { User } = require('./models/User');
console.log(User);

//application/x-222-form-urlencoded 분석
app.use(express.urlencoded({ extended: true }));
//application/json 분석
app.use(express.json());
//cookieParser
app.use(cookieParser());

//몽고DB 연결
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err)); // 몽고DB가 잘 연결됬는지 확인용

//초기 라우팅 설정
app.get('/', (req, res) => {
  res.send('hello! 웹서버 실행!@!');
});


app.get('/api/hello', (req, res) => {
  res.send("안녕하세요 ~")
})

//회원가입 관련 라우팅 설정
app.post('/api/users/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 클라이언트에서
  // 가져오면 그것을 데이터베이스에 넣어준다.
  const user = new User(req.body);

  // User model에 저장
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});


app.post('/api/users/login', (req, res) => {
   // 데이터베이스에서 조회: findOne
   // 요청된 이메일을 데이터베이스에서 조회 
   User.findOne({ email: req.body.email }, (err, user) => {
     if(!user) {
       return res.json({
         loginSuccess: false,
         message: "제공된 이메일에 해당하는 유저가 없습니다."
       })
     }

      // 요청된 이메일이 데이터 베이스에 있다면,
      // 비밀번호가 일치하는지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch) 
          return res.json({ loginSuccess: false, message: "비밀번호가 일치하지 않습니다."  })
        
        // 비밀번호까지 같다면 Token 생성
        user.generateToken((err, user) => { 
          //user: userSchem의 토큰이 전달됨
          if(err) return res.status(400).send(err);

          // 토큰을 저장 (저장 위치: 쿠키, 로컬스토리지 등 여러방법 존재)
          // 여기서는 쿠키에 저장함
          res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id})
        }) 
      })
   })
})


app.get('/api/users/auth', auth, (req, res) => {
   //여기까지 미들웨어를 통과해 왔다는 애기는 
   // Authentication 이 True 이라는 말

   //클라이언트에 원하는 정보 전달
   res.status(200).json({
     _id: req.user._id,
     isAdmin: req.user.role === 0 ? false : true,
     // role 값은 다른 값으로 변경할 수 있음 
     // 여기서는 role 0 → 일반 유저
     // role 0이 아닌 수 → 어드민(관리자)
     isAuth: true,
     email: req.user.email,
     name: req.user.name,
     lastname: req.user.lastname,
     role: req.user.role,
     image: req.user.image
   })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate( {_id: req.user._id}, 
    { token: ''}, 
    (err, user) => {
      if(err) return res.json( { success: false, err})
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Expample app listening on port ${port}`);
});
