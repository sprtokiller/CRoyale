var mongoose = require('mongoose');

var ConfigSchema = new mongoose.Schema({
  _id: {
    type: String
  }, 
  nextGamesIndex: {
    type: Number,
    required: true
  },
  docID: {
    type: Number,
    required: true
  }
});

//find/create game by style and mode
ConfigSchema.statics.getAndIncreaseNextGamesIndex = function (callback) {
  Config.findOne({docID : 42069}, function (error, config) {
  if (error || !config) { //well rip, config gone
    err = new Error();
    return callback(err, null)
    } else {
      Config.updateOne({docID : 42069}, { "$set": { "nextGamesIndex": (config.nextGamesIndex + 1) } }, function (error, succ) {
        if (error || !succ) {
          err = new Error();
          return callback(err, null) //if it was there, now it gone
          }
      });
    }

return callback(null, config.nextGamesIndex); //tedy vrátit ID
});
}


var Config = mongoose.model('Config', ConfigSchema, "Configs");
module.exports = Config;
