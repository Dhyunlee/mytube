const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({ // Schema 생성
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String, //trim 공백제거
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//user모델에 저장하기전 암호화
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) { //password 를 변경할 때
        // Salt를 사용해서 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            //사용자 비번을 해쉬로 변환
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();  //비밀번호 변경이 아니면, 다음 단계진행
    }
});

//패스워드 비교
userSchema.methods.comparePassword = function (plainPassword, cb) {

    //plainPassword = 12345  || 암호화된패스워드 = $2b$10$wssy7.NcYHDNftI2.C7qFOdbp8RZKnyzhs7wBwa8WP2AJo6iPLt12
    //plainPassword 도 암호화해서 디비에 있는 패스워드와 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

// generateToken 메서드 생성
userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken 을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    //user._id + 'secretToken' = Token

    //생성한 토큰을 디비에 저장한 후 클라이언트에 넘겨줌
    user.token = token 
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾음 다음
        // 클라이언트에서 가져온 token 과 DB에 보관된
        // 토큰이 일치하는지 확인 

        user.findOne({ "_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema); //model 생성

module.exports = { User }