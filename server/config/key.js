if (process.env.NODE_ENV === 'production') {  //env.NODE_ENV 환경 변수
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}