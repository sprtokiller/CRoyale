var mongoose = require('mongoose');
var Config = require('./model.config');
var GameSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  index: {
    type: Number,
    unique: true,
    required: true
  },
  shortname: {
    type: String,
    unique: true,
    required: true
  },
  isRunning: {
    type: Boolean,
    required: true
  },
  connections: {
    type: Number,
    required: true
  },
  gameMode: {
    type: Number,
    required: true
  },
  styleMode: {
    type: Number,
    required: true
  },
  gameCreationTime: {
    type: Number,
    required: true
  },
  gameStartTime: {
    type: Number,
    required: true
  }
}, {
    versionKey: false
  });

  GameSchema.statics.startGame = function (gameIndex, callback) {
    Game.findOne({ index: gameIndex }, function (error, game) {
      if (error || !game) { //nějakej fuck up, neudělám teda nic
        return(false);
      } else { //našel jsem hru
        Game.updateOne({ index: gameIndex }, { "$set": { "isRunning": true },  "$set": { "gameStartTime": Date.now() }  }, function (error, updated) {
          if (error || !updated) {
            //impossible lvl of fuckup
            return callback(false);
          } else {
            return callback(true); //tedy vrátit ID
          }
        })

        
      }
    });
  }

//find/create game by style and mode
GameSchema.statics.getGameForPlayer = function (gameMode, styleMode, callback) {
  //console.log("Point A");
  Game.findOne({ gameMode: gameMode, styleMode: styleMode, isRunning: false }, function (error, game) {
    if (error || !game) { //musíme tedy vytvořit
      // console.log("Point B");
      Config.getAndIncreaseNextGamesIndex(function (error, newGameIndex) {
        // console.log("got newGameIndex " + newGameIndex);
        if (error || !newGameIndex) {
        } else {
          var sn = "";
          switch (Number(gameMode)) {
            case 0:
              sn = sn + "A";
              break;
            case 1:
              sn = sn + "B";
              break;
            case 2:
              sn = sn + "C";
              break;
            default:
              sn = sn + "X";
              break;
          };
          switch (Number(styleMode)) {
            case 0:
              sn = sn + "A";
              break;
            case 1:
              sn = sn + "B";
              break;
            case 2:
              sn = sn + "C";
              break;
            default:
              sn = sn + "X";
              break;
          };
          sn = sn + String(newGameIndex);
          //  console.log(sn);
          var newGame = new Game({ _id: new mongoose.mongo.ObjectId(), index: newGameIndex, shortname: sn, isRunning: false, connections: 1, gameMode: gameMode, styleMode: styleMode, gameCreationTime: Date.now(), gameStartTime: -1 });
          newGame.save(function (err, newGame) {
            if (err) return console.error(err);
          });
          returnIndex = newGameIndex;
          return callback(null, { returnIndex: newGameIndex, shortname: sn }); //tedy vrátit ID
        }
      })
    } else { //hra tedy již existuje
      //   console.log("point C");
      Game.updateOne({ index: game.index }, { "$set": { "connections": (game.connections + 1) } }, function (error, updated) {
        //   console.log(updated);
        if (error || !updated) {
          //    console.log("Point D");
          return callback(error);
        } else {
          //     console.log("Point E"); //TODO: neupdatuje to tabulku přes newIngameID
          return callback(null, { returnIndex: game.index, shortname: game.shortname }); //tedy vrátit ID
        }
      })
    }
  });
}

//put new user into Game with the right params
/*GameSchema.statics.writePlayerIntoGameBy_id = function (searchIndex, player, callback) {
    var myGame = Game.updateOne({index : searchIndex}, { "$push": { "players": player } }, function (error, game) {
    if (error || !game) {
      console.log(error);
      console.log(game);
      err = new Error();
      return callback(err, null)
      }
  return callback(null, myGame);
  });
}*/


//find 
//GameSchema.statics.updateStatus = function (searchIndex, activeStatus) {
//   var myUser =  User.findOne().where("index").equals(searchIndex)
//  .exec();
//  myUser.isActive = activeStatus;
//  myUser.save();
//}

var Game = mongoose.model('Game', GameSchema, "Games");
module.exports = Game;
