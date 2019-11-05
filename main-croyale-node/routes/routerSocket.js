var Game = require('../models/model.game');
module.exports = function (socket, io) {

  socket.on("sendClicks", socketObject => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    console.log(socketObject);
  });

  socket.on("sendBuy", playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", "You did not cheat");
  });
  
};