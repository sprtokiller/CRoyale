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
    type: Number, //0=No, 1=Yes, 2=InGame
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

//Update user active status
UserSchema.statics.updateStatus = function (searchIndex, activeStatus) {
   var myUser =  User.findOne().where("index").equals(searchIndex)
  .exec();
  myUser.isActive = activeStatus;
  myUser.save();
}

UserSchema.statics.createDefaultUser = function (index, role) {
  var newUser = new User({
    _id: new mongoose.mongo.ObjectId(),
    index: index,
    role: role,
    isActive: 0,
    friendAcc_ids: [],
    lastSkinID: 1,
    skinsAccesible: [0, 1, 2, 3],
    titlesAccesible: ["Newbie", "Greenhorn", "Begginer"],
    picture: "http://placehold.it/32x32",
    level: 1,
    xp: 0,
    balance: 0,
    gameStats: {
     totalClickCount: 0,
     totalKillCount: 0,
     totalDeathCount: 0,
     totalGamesPlayed: 0,
     topRankSolo: 100,
     topRankDuo: 100,
     topRankSquad: 100,
     totalPointsFarmed: 0,
     totalDmgDealt: 0,
     totalUpgradesBought: 0,
     totalSkillsBought: 0,
     totalPoints_att: 0,
     totalPoints_farm: 0,
     totalPoints_def: 0
   }
   });
   newUser.save(function (err, returnLogin) {
     //console.log(returnLogin);
 });
}



var User = mongoose.model('User', UserSchema, "Users");
module.exports = User;
