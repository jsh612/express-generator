//config.js 파일은 우리 예제 프로젝트에서 사용할 MongoDB 서버의 정보와,
// JWT 토큰을 만들 때 사용 될 secret 키의 정보를 지니고있습니다

//secretKey는 JSOn Web Token을 signing할때 사용
module.exports = {
  secretKey: "12345-67890-09876-54321",
  mongoUrl: "mongodb://localhost:27017/conFusion",
  facebook: {
    clientId: "CLIENT_ID",
    clientSecret: "SECRET"
  }
};
