import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class IngamesocketService {


  private url = 'http://localhost:3001';
  socket: SocketIOClient.Socket;
  constructor() { 
    var user = JSON.parse(localStorage.getItem('currentUser'));
    var userToken;
    var myUsername;
    var isRegistered;
    var localGameMode;
    var localStyleMode;
    if (localStorage.getItem('localGameMode')) {
      localGameMode = Number(localStorage.getItem('localGameMode'));
    } else { localGameMode = 0;
    }
    if (localStorage.getItem('localStyleMode')) {
      localStyleMode = Number(localStorage.getItem('localStyleMode'));
    } else { localStyleMode = 0;
    }
    if (user) {
      isRegistered = true;
      userToken = user.token;
      myUsername = user.username } else {
      isRegistered = false;
      userToken = "guest";
      myUsername = ""}
    this.socket = io(this.url, {
    query: {
      token: userToken,
      username: myUsername,
      title: "Tester",
      skinID: 1,
      registred: isRegistered,
      styleMode: localStyleMode,
      gameMode: localGameMode
    }
   
    });
  }
  //EMITTERS
  getGameData(id: number) {
    
    this.socket.emit('getGameData', id);
  }
  eventName1(id: number) {
    
    this.socket.emit('eventName1', id);
  }
  //EMITTERS
  //binds to server emits
//  otherPlayerData = this.socket.addEventListener("otherPlayerData", function(e) {
//    var returnedData = JSON.parse(e);
//    console.log(returnedData);
//});
  //binds to server emits

  //HANDLER
  onTokenExpired() {
    return Observable.create(observer => {
      this.socket.on('tokenExpired', routeMeTo => {
        console.log("I got rerouted to:" + routeMeTo)
        observer.next(routeMeTo);
      });
    });
  }
  onAliveUpdate() {
    return Observable.create(observer => {
      this.socket.on('aliveUpdate', alive => {
        observer.next(alive);
      });
    });
  }
  //HANDLER
}
 