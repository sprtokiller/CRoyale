import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {
  private messagesSource = new Subject<void>();
  /*public messages$ = this.messagesSource.asObservable();
  public msg1: Zprava = {id: 0, text: "", color: "black"}
  public msg2: Zprava = {id: 1, text: "Your offensive branch is: FIRE", color: "Red"}
  public msg3: Zprava = {id: 2, text: "Your defensive branch is: Armor", color: "RoyalBlue"}
  public nextID: number = 3; */
  constructor() {
    
  }
  clickIncome(target : Number){
    switch (target) {
      case 2: //full hit
        
        break;
      case 1: //part hit
        
        break;
      default: //no hit

        break;
    }
  }
  /*pushMsg(msgIn : Zprava){
    this.nextID++;
    this.msg1 = this.msg2;
    this.msg2 = this.msg3;
    this.msg3 = msgIn;
    //console.log(msgIn.text);
    this.messagesSource.next();
  }*/
}
