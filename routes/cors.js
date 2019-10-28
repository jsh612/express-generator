const express = require("express");
const cors = require("cors");
const app = express();

// whitelist = (내 서버가) 접근을 허락할 웹사이트
const whitelist = ["http://localhost:3000", "https://localhost:3443"];

// var corsOptionsDelegate = (req, callback) => {
//   var corsOptions;
//   console.log('req.header("Origin"):::::::', req.header("Origin"));
//   if (whitelist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true };
//   } else {
//     corsOptions = { origin: false };
//   }
//   callback(null, corsOptions);
// };
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
};

console.log("cors(corsOptions)::::", cors(corsOptions));
exports.cors = cors(); //옵션없는 cors = 모든 도메인의 request 허용
exports.corsWithOptions = cors(corsOptions);
