//이 파일은 우리가 환경설정한 인증전략을 저장하기위해 사용한다.

//Let's now configure the passport with the new local strategy 
//and then we will export this from this file because this is going to be a node module

// 이 파일은 노드 모듈을 구성하게 된다. 따라서 이파일이 정삭적으로 export 되지 않을 경우
// node module이 정상적으로 정의 되지 않아 오류가 발생하겠된다.
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user');

//1. User.authenticate() 의미.
//   - the mongoose plugin itself adds this function called user.authenticate.
//   - Generates a function that is used in Passport's LocalStrategy
//   - https://github.com/saintedlama/passport-local-mongoose#static-methods

//2, new LOcalStrategy 내부 콜백 함수
//  -  Strategies require what is known as a verify callback. 
//    The purpose of a verify callback is to find the user 
//    that possesses a set of credentials.
//  - http://www.passportjs.org/docs/configure/

//lcoal을 정의하게된다.
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