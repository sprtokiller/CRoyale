var Game = require('../models/model.game');
module.exports = function (socket, io) {

  socket.on("sendClicks", clickObject => { //poslat viditelná data z databáze (=staty hracu?), bude cyklicky cca 1/s pro každého vyvolávané clientem
    //if is truthy TO-DO ?
    clickObject.forEach(click => {
      //if no cheat TO-DO
      aprox = Math.pow(click.c.x - click.t.x, 2) + Math.pow(click.c.y - click.t.y, 2);
      if (aprox <= 25) {
        socket.PLAYER_balance += (socket.PLAYER_clickWorth * 1.5);
        console.log("Very good hit");
      } else if (aprox <= 400) {
        socket.PLAYER_balance += (socket.PLAYER_clickWorth * 1.2);
        console.log("OK hit");
      } else {
        socket.PLAYER_balance += socket.PLAYER_clickWorth;
        console.log("Eh click");
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