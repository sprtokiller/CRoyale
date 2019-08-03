var Game = require('../models/model.game');
module.exports = function(socket, io) {
  
  socket.on("getGameData", playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    console.log('Nekdo chce data')
    socket.emit("GameData", "MandoraSecret");
  });

  socket.on("sendClicks", playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", "You did not cheat");
  });

  socket.on("sendBuy", playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", "You did not cheat");
  });

  socket.on("disconnect", function() {
    console.log("Nekdo se odpojil"); //TODO, list of sockets, read from there and then delete 
    socket.to(socket.gameRoom).emit('aliveUpdate', io.sockets.adapter.rooms[socket.gameRoom].length );
  })
};