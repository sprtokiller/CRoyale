var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: false,
    trim: true
  },
  passwordHash: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  relatedUser_index: {
    type: Number,
    unique: false,
    required: true,
    trim: true
  },
  externalType: {
    type: String,
    unique: false,
    required: true,
    trim: false
  },
  externalID: {
    type: String,
    unique: true,
    required: false,
    trim: false
  }
});


//authenticate input against database
LoginSchema.statics.authenticate = function (externalType, externalID, username, password, callback) {
  switch (externalType) {
    case "NATIVE":
      Login.findOne({ username: username }, function (error, login) {
        if (error || !login) {
          err = new Error();
          return callback(err)
        }
        bcrypt.compare(password, login.passwordHash, function (err, result) {
          if (result === true) {
            return callback(null, login);
          } else {
            return callback();
          }
        })
      });

      break;
    case "GOOGLE":
      Login.findOne({ externalID: externalID })
        .exec(function (err, login) {
          if (err) {
            return callback(err)
          } else if (!login) { //automaticka registrace chybi
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
          } else {
            return callback(null, login);
          }
        });
      break;
    default:

      break;
  }

}

//hashing a password before saving it to the database
LoginSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 11, function (err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  })
});


var Login = mongoose.model('Login', LoginSchema, "Logins");
module.exports = Login;
