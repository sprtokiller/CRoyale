var Game = require('../models/model.game');
module.exports = function (socket, io) {

  socket.on("sendClicks", clickObject => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    //if is truthy TO-DO ?
    clickObject.forEach(click => {
      //if no cheat TO-DO
      aprox = Math.pow(click.c.x - click.t.x, 2) + Math.pow(click.c.y - click.t.y, 2);
      if (aprox <= 16) {
        socket.PLAYER_balance = Math.round((socket.PLAYER_balance + (socket.PLAYER_clickWorth * 1.5)) * 100) / 100;
      } else if (aprox <= 100) {
        socket.PLAYER_balance = Math.round((socket.PLAYER_balance + (socket.PLAYER_clickWorth * 1.2)) * 100) / 100;
      } else {
        socket.PLAYER_balance = Math.round((socket.PLAYER_balance + socket.PLAYER_clickWorth) * 100) / 100;
      } 
    });
    console.log(socket.PLAYER_balance);
    console.log("------------------")
  });

  socket.on("sendBuy", playerID => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    safeJoin(docId);
    socket.emit("document", "You did not cheat");
  });
  
};