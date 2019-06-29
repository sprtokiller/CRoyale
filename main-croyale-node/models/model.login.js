var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var LoginSchema = new mongoose.Schema({
  ID: {
    type: Number,
    unique: true,
    required: true,
    trim: true
  },
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
  relatedUserID: {
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
        Login.findOne({ username: username })
         .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      console.log(password);
      console.log(user.password)
      bcrypt.compare(password, user.passwordHash, function (err, result) {
        if (result === true) {
          console.log("yes");
          return callback(null, user);
        } else {
          console.log("no");
          return callback();
        }
      })
    });
      break;
    case "GOOGLE":
        User.findOne({ externalID: externalID })
        .exec(function (err, user) {
        if (err) {
        return callback(err)
      } else if (!user) { //automaticka registrace chybi
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
       } else {
        return callback(null, user);
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


var Login = mongoose.model('Login', LoginSchema);
module.exports = Login;
