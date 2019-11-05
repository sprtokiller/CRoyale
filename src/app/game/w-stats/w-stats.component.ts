import { Component, OnInit, Input } from '@angular/core';
import { Zprava } from './zprava';
import { StatsService } from 'src/app/_services/stats.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-w-stats',
  templateUrl: './w-stats.component.html',
  styleUrls: ['./w-stats.component.css']
})
export class WStatsComponent implements OnInit {

UBalance:number=912093210941094;
private messagesRef: Subscription = null;
private zpravas: Zprava[]; 
  constructor(private statsService: StatsService) {
   }

  ngOnInit() {
    this.messagesRef = this.statsService.messages$.subscribe(()=>{
      this.updateMessageBox();
  });
    this.zpravas = [this.statsService.msg1, this.statsService.msg2, this.statsService.msg3];
    let test1: Zprava = {id: this.statsService.nextID, text: "Final Welcome Message", color: "white"};
    this.statsService.pushMsg(test1);
  }

  updateMessageBox(){
    this.zpravas[0] = this.statsService.msg1;
    this.zpravas[1] = this.statsService.msg2;
    this.zpravas[2] = this.statsService.msg3;
  }
}
