var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user.js');
const passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//가입 라우터 구성
router.post('/signup', (req, res, next) => {

  //new User() : User 모델을 이용하여 새로운 다큐먼트를 생성
  //register : passport-local-mongoose에 의해 추가된 메소드
  // console.log("new User::::::",new User({username: req.body.username}))//유저이름과 _id가 있는 객체
  User.register(new User({username: req.body.username}), req.body.password, 
    (err, user) => {
      // console.log('resister 콜백의 user값::::::', user);//username과 salt, hash가 담긴 객체 출력
      if (err) {
        //이미 등록된 유저네임인 경우 에러 처리
        res.statusCode = 500;
        res.setHeader('Content-type', 'application/json');
        res.json({err: err});
      }
      else {
        // console.log("passport.authenticate() 출력괎", passport.authenticate('local'));//authenticate 함수 출력

        //아라와 같은 문법은 passport에서 요구하는 것이다.
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({success: true, status: 'Registration Successful'});
        })
      }
  })
});




//로그인 라이터 구성
router.post('/login', 
  passport.authenticate('local'),
  //the passport authenticate local will automatically 
  //add the user property to the request message. 

  (req, res, next) => {
   //인증이 성공된 경우에만 이 콜백 실행
   //실패한경우 passport.authenticate('local') 가 자동으로 클라이언트에게 실패라고 보낸다.
   //http://www.passportjs.org/docs/authenticate/

   //클라이언트에게 인증 성공을 보여주기 위한코드
   res.statusCode = 200;
   res.setHeader('Content-type', 'application/json');
   res.json({success: true, status: '로그인 성공'});

});



//로그아웃 구현
router.get('/logout', (req, res, next) => {
  console.log("로그아웃에서 req.session.user",req.session.user)
  if (req.user) {
    console.log('로기은내 user', req.user);
    //서버쪽에 설정된 session을 지우기 요청
    req.session.destroy();
    //클라이언트 쪽의 쿠키지우기
    // res.clearCookie('session-id');// 이렇게 쿠키를 지우려고 한는경우 안지워짐.
    res.clearCookie('session-id', {httpOnly:true,path:"/"});//이와 옵션을 같이 넣어줘야 제대로 삭제된다
    //유저를 로그아웃인 루트로 이동시킨다.
    res.redirect('/');
    
  }
  else {
    console.log('이미로그아웃2')
    var err = new Error('You arer not logged in!!!')
    err.status = 403;
    next(err);
  }
});


module.exports = router;





