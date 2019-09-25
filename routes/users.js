var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user.js');

var router = express.Router();
router.use(bodyParser.json());



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//가입 라우터 구성
router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if (user !== null) {
      //이미 등록된 유저네임인 경우 에러 처리
      var err = new Error(`User ${req.body.username} already exists!`);
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username, 
        password: req.body.password
      });
    }
  })
  .then((user) => {
    //등록 성공여부 메시지와, 유저이름을 그냥 확인차 보려고 하는 코드임
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json({status: 'Registration Successful', user: user});
  }, (err) => next(err))
  .catch((err) => next())
});




//로그인 라이터 구성
router.post('/login', (req, res, next) => {
  console.log("req.session.user::::::", req.session.user)
  if (!req.session.user) {
    console.log('여기다')
    //만약 요청하는 쿠키(세션이용시 세션)들 중에 user가 없다면.
    //이것은 아직 해당 유저가 권한(like 로그인)을 얻지 못했음을 의미.
    var authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);
    if (!authHeader) {
      //이 조건문은 왜 필요한지 모르겠다.
      var err = new Error('You are not authenticated!');
      console.log("여기안에")
  
      //WWW-Authenticate 은 권한입증 메소드를 정의한다
      //따라서 다음은 res 헤더에 권한입증 메소드를 Basic 이라고 정의하는 것이다.
      //에러는 마지막에 한번에 처리하기위해 일단은 next로 넘긴다.
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    // console.log('authHeader 내용: ', authHeader);

    //1. authHeader를 split 하여 사용하는 이유:
    //   - the first element of the array contains Basic. 
    //     The second element of the array is where this base64 encoded string exist.
    //2. .toString().split(':') 이유
    //   - Buffer 타입 데이터를 문자열로 만든후에 username 과 password로 분리
    var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    
    var username = auth[0];
    var password = auth[1];
    

    User.findOne({username: username})
    .then((user) => {
      // console.log("찾아온 사용자 정보", user);
      if (user === null) {
        var err = new Error(`User ${username} dose not exist`);
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error(`Your password is incorrect!!!`);
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        //모든 사항 충족시(로그인 요건 완성)
        console.log('세션1', req.session)

        //req.session => session을 저장하거나 접근할 때 사용한다.
        //이부분에서 쿠키와 session이 생성이된다.
        req.session.user = 'authenticated';
        console.log('세션2', req.session)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Conent-Type', 'text/plain');
    res.end('You are already authenticated!!!')
  } 
});



//로그아웃 구현
router.get('/logout', (req, res, next) => {
  console.log("로그아웃에서 req.session",req.session)
  if (req.session.user) {
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





