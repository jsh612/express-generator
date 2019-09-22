var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

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

app.use('/', indexRouter);// 로그인전 시작 페이지는 접속가능
app.use('/users', usersRouter);// 로그인 라이터 시작



// 미들웨어는 순서데로 실행된다.
// app.use(express.static(path.join(__dirname, 'public'))); 이 미들웨어 전에 해주어야
// 유저가 서버에 접근하기전에 권한 유무를 확인하여 통제 가는하다.
function auth(req, res, next) {

  /* //req.signedCookies 는 요청한는 쿠키들을 보여준다.
  console.log("req.signedCookies", req.signedCookies); */

  //epress-session 모듈은 request 메시지에 req.session을 추가시킨다.
  console.log("req.session 내용보기",req.session.user)

  if (!req.session.user) {
    /* -위의 if 조건문 설명-
    만약 요청하는 세션들 중에 user가 없다면.
    이것은 아직 해당 유저가 권한(로그인)을 얻지 못했음을 의미. */
    console.log("왜안되",req.session.user);
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  } 
  else {
    //클라이언트가 이미 세션을 생성했다면
    //에지 해당 서버에 접근해서 아래에 이어지는 코드 진행
    if (req.session.user === 'authenticated') {
      next()
    } else {
      //에초에 쿠키 생성시 정확인 권한인증이 된 경우에만 쿠키를 생성하였으므로
      //이 else 절은 작동할 일이 잆다.
      //하지만, 이걸 작성한 이유는  이 부분에서 한번 에러를 체크하기 위함이다.
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));




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
