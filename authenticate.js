//이 파일은 우리가 환경설정한 인증전략을 저장하기위해 사용한다.(인증관련 환경설정 공간)

//Let's now configure the passport with the new local strategy 
//and then we will export this from this file because this is going to be a node module

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//1.ExtractJwt 
// - Extracting the JWT from the request
// - https://www.npmjs.com/package/passport-jwt#extracting-the-jwt-from-the-request

const jwt =  require('jsonwebtoken');
//jsonwebtoken : JSON Web Token 을 손쉽게 생성하고, 또 검증도 해줍니다.

const config = require('./config');




//1. User.authenticate() 의미.
//   - the mongoose plugin itself adds this function called user.authenticate.
//   - Generates a function that is used in Passport's LocalStrategy
//   - https://github.com/saintedlama/passport-local-mongoose#static-methods

//2, new LocalStrategy 내부 콜백 함수
//  -  Strategies require what is known as a verify callback. 
//    The purpose of a verify callback is to find the user 
//    that possesses a set of credentials.
//  - http://www.passportjs.org/docs/configure/


//lcoal을 정의하게된다.
// console.log('LocalStrategy:::::::', LocalStrategy);//function Strategy(options, verify){...}
exports.local = passport.use(new LocalStrategy(User.authenticate()))

//1.serialize(직렬화)
//  : 객체를 전송가능한 형태로 변환 하는것
//  : 여기서는 로그인이 성공하면, serializeUser 메서드를 이용하여 사용자 정보를 Session에 저장할 수 있다
//2.deserialize(역직렬화)
//  : 직렬화된 데이터를 원래의 객체형태로 되돌리는것
//  : 여기선 쿠키를 서버에 보내 인증처리하려고 사용
//3.User.serializeUser() // User.deserializeUser() 
//  : passport-local-mongoose의 메소드임.
//  : https://github.com/saintedlama/passport-local-mongoose#static-methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



exports.getToken = function(user) {
    //1.jwt.sign : JSON Web Token을 만든도록 도와줌
    //  - expiresIn = 해동 토큰의 유효기간을 말한다.
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600})
}

const opts = {}

//1.어떻게 jsonwebtoken을 request 메시지로부터 추출할 것인지 정의
//2.fromAuthHeaderAsBearerToken()
//  : creates a new extractor that looks for the JWT in the authorization 
//   header with the scheme 'bearer'
//   (https://www.npmjs.com/package/passport-jwt#extracting-the-jwt-from-the-request)
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


//this is the JWT passport strategy that i've just configured here.
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        //1. done 
        //  - passport가 request 메시지를 분석할때 정보를 축출해서 우리의 request메시지에 load 할수 있도록 한다.
        //  - you will be passing back information to passport which it will then use for loading things onto the request message. 
        //    So, when passport parses the request message, 
        //    it will use the strategy and then extract information, 
        //    and then load it onto our request message.

        console.log("auth.js의 Jwt payload: ", jwt_payload);
        // console.log('auth.js의 User', User);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            console.log('{_id: jwt_payload._id}', {_id: jwt_payload._id})
            if (err) {
                return done(err, false); //false는 해당 user가 없다는 의미
            } 
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


// using this to verify an incoming user
exports.verifyUser = passport.authenticate('jwt', {session: false}); // 세션은 생성하지 않는다.
exports.verifyAdmin = (req, res, next) => {
    if (res.user.admin) {
        next()
    } else {
        next(err)
    }
}