var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
console.log("스토어보기",FileStore)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => console.log(err));



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* cookie-parser는 더이상 필요하지 않으므로 주석처리한다.
그 이유는 express-session은 쿠키를 바로 읽거나 쓸 수 있기때문이다. */
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

//미들웨어는 순서데로 실행된다.
//app.use(express.static(path.join(__dirname, 'public'))); 이 미들웨어 전에 해주어야
//유저가 서버에 접근하기전에 권한 유무를 확인하여 통제 가는하다.
function auth(req, res, next) {

  /* //req.signedCookies 는 요청한는 쿠키들을 보여준다.
  console.log("req.signedCookies", req.signedCookies); */

  //epress-session 모듈은 request 메시지에 req.session을 추가시킨다.
  console.log("req.session 내용보기",req.session)

  if (!req.session.user) {
    //만약 요청하는 쿠키(세션이용시 세션)들 중에 user가 없다면.
    //이것은 아직 해당 유저가 권한(like 로그인)을 얻지 못했음을 의미.
    let authHeader = req.headers.authorization;
  
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
  
      //WWW-Authenticate 은 권한입증 메소드를 정의한다
      //다라서 다음은 res 헤더에 권한입증 메소드를 Basic 이라고 정의하는 것이다.
      //에러는 마지막에 한번에 처리하기위해 일단은 next로 넘긴다.
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    console.log('authHeader 내용: ', authHeader);
    //1. authHeader를 split 하여 사용하는 이유:
    //   - the first element of the array contains Basic. 
    //     The second element of the array is where this base64 encoded string exist.
    //2. .toString().split(':') 이유
    //   - Buffer 타입 데이터를 문자열로 만든후에 username 과 password로 분리
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var usertName = auth[0];
    var password = auth[1];
  
    if (usertName === 'admin' && password === 'password') {
      /* //클라이언트가 쿠키를 설정
      res.cookie('user', 'admin', {signed: true}) */

      //epress-session 사용시에는 cookie를 작성하는대신 다음과 같이 session을 이용한다
      req.session.user = 'admin';

      //네임과 비번이 일치 한다면 
      // 다음 미들웨어 실행가능 (즉, 권한이 입증되어서 서버와 통신 가능하게된것이다.)
      next();
    } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  } 
  else {
    //클라이언트가 이미 쿠키를 생성했다면
    //에지 해당 서버에 접근해서 아래에 이어지는 코드 진행
    if (req.session.user === 'admin') {
      next()
    } else {
      //에초에 쿠키 생성시 정확인 권한인증이 된 경우에만 쿠키를 생성하였으므로
      //이 else 절은 작동할 일이 잆다.
      //하지만, 이걸 작성한 이유는  이 부분에서 한번 에러를 체크하기 위함이다.
      var err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
