const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
//위 패키지가 username과 password를 자동으로 추가 시켜주므로 아래의 User 스키마에서
// username과 password을 지워도 된다

const User = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
//User스키마에 username & password 자동으로 추가

module.exports = mongoose.model('User', User);