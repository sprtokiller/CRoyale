import { Component, OnInit, Input } from '@angular/core';
import { Zprava } from './zprava';
import { StatsService } from 'src/app/stats.service'
@Component({
  selector: 'app-w-stats',
  templateUrl: './w-stats.component.html',
  styleUrls: ['./w-stats.component.css']
})
export class WStatsComponent implements OnInit {
UName:string="DickObraz";
UBalance:number=912093210941094;
public z0 = {};

z1:Zprava = {id: 1, text: "oof", color: "red" };
z2:Zprava = {id: 1, text: "oof", color: "white" };
z3:Zprava = {id: 1, text: "oof", color: "white" };
Zpravas: Zprava[] = [this.z1, this.z2, this.z3];

  constructor(private statsservice: StatsService) {

      this.statsservice.myMethod$.subscribe((z0) => {
      this.z0 = z0; // And he have data here too!
       });
   }

  ngOnInit() {
  }
 
}
