const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const multer = require("multer");
const cors = require("./cors");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // file = multer 통해 req.body에 생성된 객체
    cb(null, "public/images"); // cb의 처번째 인자는 error
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // 저장되는 filename을 사용자가 업로드한 파일명으로한다.
  }
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    // 클라이언트는 preflight에 옵션을 포함시켜 보낼것이다. 이를 처리하기위해 작성.
    res.sendStatus(200);
  })
  .get(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("GET operation not supported on /imageUpload");
    }
  )
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.single("imageFile"),
    (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /imageUpload");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("DELETE operation not supported on /imageUpload");
    }
  );

module.exports = uploadRouter;
