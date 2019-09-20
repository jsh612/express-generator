var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
app.use(cookieParser());

//미들웨어는 순서데로 실행된다.
//app.use(express.static(path.join(__dirname, 'public'))); 이 미들웨어 전에 해주어야
//유저가 서버에 접근하기전에 권한 유무를 확인하여 통제 가는하다.
function auth(req, res, next) {
  console.log("req.headers", req.headers);

  let authHeader = req.headers.authorization;

  if (!authHeader) {
    let err = new Error('You are not authenticated!');

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
  const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  const usertName = auth[0];
  const password = auth[1];

  if (usertName === 'admin' && password === 'password') {
    //네임과 비번이 일치 한다면 
    // 다음 미들웨어 실행가능 (즉, 권한이 입증되어서 서버와 통신 가능하게된것이다.)
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
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
