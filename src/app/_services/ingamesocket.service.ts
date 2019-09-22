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
  }
  connect(){
    
    var user = JSON.parse(localStorage.getItem('currentUser'));
    var userToken;
    var myUsername;
    var isRegistered;
    var localGameMode;
    var localStyleMode;
    var isFromMenu;
    var playerTitle;
    if (localStorage.getItem('localGameMode')) {
      localGameMode = Number(localStorage.getItem('localGameMode'));
    } else {
      localGameMode = 0;
    }
    if (localStorage.getItem('localStyleMode')) {
      localStyleMode = Number(localStorage.getItem('localStyleMode'));
    } else {
      localStyleMode = 0;
    }
    if (localStorage.getItem('isFromMenu')) { //1 == button clicked, 0 == nop, will get redirected by onDisconnectPromise
      isFromMenu = Number(localStorage.getItem('isFromMenu'));
    } else {
      isFromMenu = 0;
    }
    
    if (user) {

      if (localStorage.getItem('playerTitle')) {
        playerTitle = localStorage.getItem('playerTitle');
      } else {
        playerTitle = "";
      }

      isRegistered = true;
      userToken = user.token;
      myUsername = user.username;
      console.log("Connection as:");
      console.log(user);
      console.log(myUsername);
    } else {
      playerTitle = "";
      isRegistered = false;
      userToken = "guest";
      myUsername = ""
    }
    this.socket = io(this.url, {
      query: {
        token: userToken,
        username: myUsername,
        title: "Tester", //TODO: connect this to actual skin/title picking
        skinID: 1,
        registred: isRegistered,
        styleMode: localStyleMode,
        gameMode: localGameMode,
        isFromMenu: isFromMenu,
        playerTitle : playerTitle
      }

    });
  }
  disconnect(){
    try {
      this.socket.disconnect();
    } catch {

    }
  }
  //EMITTERS
  getGameData(isOnInit: boolean) {

    this.socket.emit('getGameData', isOnInit);
  }
  eventName1(id: number) {

    this.socket.emit('eventName1', id);
  }
  //EMITTERS


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
  onTileDataUpdate() {
    return Observable.create(observer => {
      this.socket.on('tileDataUpdate', tiles => {
        observer.next(tiles);
      });
    });
  }
  onDisconnectPromise() {
    return Observable.create(observer => {
      this.socket.on('disconnectPromise', ans => {
        observer.next(ans);
      });
    });
  }
  //HANDLER
}
