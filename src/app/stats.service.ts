import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Zprava } from './content/w-stats/zprava'
@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private messagesSource = new Subject<void>();
  public messages$ = this.messagesSource.asObservable();
  public msg1: Zprava = {id: 0, text: "", color: "black"}
  public msg2: Zprava = {id: 1, text: "Your offensive branch is: FIRE", color: "Red"}
  public msg3: Zprava = {id: 2, text: "Your defensive branch is: Armor", color: "RoyalBlue"}
  public nextID: number = 3;
  constructor() {

  }
  pushMsg(msgIn : Zprava){
    this.nextID++;
    this.msg1 = this.msg2;
    this.msg2 = this.msg3;
    this.msg3 = msgIn;
    console.log(msgIn.text);
    this.messagesSource.next();
  }
  msgObservable() {
  //  return this.msgs.asObservable();
  //  return this.test.

  }
}
