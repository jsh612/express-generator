var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//session 생성, FileStore 는 해당 세션이 영구적으로 저장시킴
var session = require("express-session");
var FileStore = require("session-file-store")(session);

const passport = require("passport");
const authenticate = require("./authenticate"); //authenticate 파일을 실행시킨다.
const config = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");
const uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favoriteRouter");

const mongoose = require("mongoose");

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(
  db => {
    console.log("Connected correctly to server");
  },
  err => console.log(err)
);

var app = express();

// https가 아닌 http(보안되지 않는)로 접속시(경로에 상관없이)
// https로 redirect
app.all("*", (req, res, next) => {
  // -req.secure
  //   : A Boolean property that is true if a TLS connection is established.
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize()); //passport 구동

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
