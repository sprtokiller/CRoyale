var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var Config = require('../models/model.config');

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


//register
LoginSchema.statics.register = function (externalType, externalID, username, password, callback) {
  console.log("model login register");
  Config.getAndIncreaseNextUserIndex(function (error, newUserIndex) {
    if (error || !newUserIndex) {
      return console.error();
    } else {
      bcrypt.hash(password, saltRounds, function(err, hash) { //TODO: what if not NATIVE
        if (err) return console.error(err); else {
          var newLogin = new Login({ _id: new mongoose.mongo.ObjectId(), username: username, passwordHash: hash, relatedUser_index: newUserIndex, externalType: externalType, externalID: externalID });
          newLogin.save(function (err, returnLogin) {
            if (err) return console.error(err);
            else {
              console.log(returnLogin);
              return returnLogin;
            }
          });
        }
      });
    }
  })



 
}

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
    case "GOOGLE": //TODO external login auth + registrace
      Login.findOne({ externalID: externalID })
        .exec(function (err, login) {
          if (err) {
            return callback(err)
          } else if (!login) { //automaticka registrace chybi TODO
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

//check if user exists in db, if so return tru, else return false
LoginSchema.statics.checkMateExists = function (externalType, externalID, username, callback) {
  switch (externalType) {
    case "NATIVE":
      Login.findOne({ username: username }, function (error, login) {
        if (!login) {
          return callback(false)
        } else {
          return callback(true)
        }
      });
      break;

    default:
      Login.findOne({ externalID: externalID }, function (error, login) {
        if (!login) {
          return callback(false)
        } else {
          return callback(true)
        }
      });
      break;
  }
}

var Login = mongoose.model('Login', LoginSchema, "Logins");
module.exports = Login;
