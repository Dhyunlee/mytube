const { User } = require('../models/User');

// 인증 처리를 하는 곳
let auth = (req, res, next) => {

    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한후 유저를 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true })

        req.token = token;
        req.user = user;
        //클라이언트측에서 token, user 정보를 사용할 수 있게
        //request(req)에 넣어줌
        next();
    })

    // 유저가 있으면 Okey, 유저가 없으면 인증 No
}

module.exports = { auth };