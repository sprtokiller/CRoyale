var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
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
  
  var newLogin2 = new Login({ _id: new mongoose.mongo.ObjectId(), username: "Dewiaton", externalID: "no-id", externalType: "NATIVE", passwordHash: "myhash", relatedUser_index: 3 });
  newLogin2.save(function (errwtf, newLogin) {
    console.log("I am here BX");
    if (errwtf) {
      console.log(errwtf);
      err = new Error();
      return callback(err)
    } else {
      console.log("true");
      return callback(true);
    }
  });

  switch (externalType) {
    case "NATIVE":
     //get bcrypt to hash pass with 10 rounds
      bcrypt.hash(password, 10, function (err, hash) {
        Config.getAndIncreaseNextUserIndex(function (error, newUserIndex) {
          // console.log("got newGameIndex " + newGameIndex);
          if (error || !newUserIndex) {
            err = new Error();
            return callback(err)
          } else {
            console.log("I am here A");
            var newLogin = new Login({ _id: new mongoose.mongo.ObjectId(), username: username, externalID: externalID, externalType: externalType, passwordHash: hash.toString(), relatedUser_index: newUserIndex });
            newLogin.save(function (errwtf, newLogin) {
              console.log("I am here B");
              if (errwtf) {
                console.log(errwtf);
                err = new Error();
                return callback(err)
              } else {
                console.log("true");
                return callback(true);
              }
            });
          }
        })

      })


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
