var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//session 생성, FileStore 는 해당 세션이 영구적으로 저장시킴
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');

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


//session을 설정 작성
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());//passport 구동
app.use(passport.session());//session 연결
//1. users.js의 로그인 포스트에서 로그인시 자동으로 req.user session에 저장 된다.
//2. the passport authenticate local will automatically add the user property 
//  to the request message. (users.js의 login post)
//  So, it'll add req.user and then, the passport session that 
//  we have done here will automatically serialize that user information and 
//  then store it in the session. 


app.use('/', indexRouter);// 로그인전 시작 페이지는 접속가능
app.use('/users', usersRouter);// 로그인 라이터 시작




// 미들웨어는 순서데로 실행된다.
// app.use(express.static(path.join(__dirname, 'public'))); 이 미들웨어 전에 해주어야
// 유저가 서버에 접근하기전에 권한 유무를 확인하여 통제 가는하다.
function auth(req, res, next) {
  if (!req.user) {
    //passport session 미들웨어에서 자동적으로 req.user를 로드한다 
    //위의 app.use(passport.intilize() 와 passport.session() 참고)
    //(req.session.user 라고 쓸필요 없음)

    /* -위의 if 조건문 설명-
    만약 요청하는 세션들 중에 user가 없다면.
    이것은 아직 해당 유저가 권한(로그인)을 얻지 못했음을 의미. */
    console.log("로그인못했을시",req.user);
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  } 
  else {
    //클라이언트가 로그인을 생성했다면
    //해당 서버에 접근해서 아래에 이어지는 코드 진행
    next();
  }
  /* if req.user is not present, 
  then that means that the authentication has not been done correctly so, 
  that's why you indicate the error. Otherwise, you are authenticated. 
  If req.user is present, that means the passport has done the authentication and 
  the req.user user is loaded on to the request message, and so you can just go on further down.  */
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
