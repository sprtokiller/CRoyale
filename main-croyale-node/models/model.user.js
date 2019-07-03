var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id: {
    type: String
  }, //index
  index: {
    type: Number,
    unique: true,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    unique: false,
    required: false
  },
  friendAcc_ids: {
    type: Array,
    unique: false,
    required: true
  },
  lastSkinID: {
    type: Number,
    unique: false,
    required: true
  },
  skinsAccesible: {
    type: Array,
    unique: false,
    required: true
  },
  titlesAccesible: {
    type: Array,
    unique: false,
    required: true
  },
  picture: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    unique: false,
    required: true
  },
  xp: {
    type: Number,
    unique: false,
    required: true
  },
  balance: {
    type: Number,
    unique: false,
    required: true
  },
  gameStats: {
    type: Object,
    unique: false,
    required: true
  },
});


//authenticate input against database
UserSchema.statics.getBasicUserInfoBy_id = function (searchIndex, callback) {
  User.findOne({index : searchIndex}, function (error, user) {
    if (error || !user) {
      console.log(error);
      console.log(user);
      err = new Error();
      return callback(err)
       }
    var userSimpleData = {
      role: user.role,
      oid: user._id,
      index: searchIndex,
      level: user.level,
      xp: user.xp
  };
 // console.log(userSimpleData);
  return callback(null, userSimpleData);
  });
}

var User = mongoose.model('User', UserSchema, "Users");
module.exports = User;
