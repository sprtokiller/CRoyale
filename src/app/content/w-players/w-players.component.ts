import { Component, OnInit } from '@angular/core';
import { PLAYERTILES } from './src/MOCK';
import { PlayerTile } from './src/playerTile';
@Component({
  selector: 'app-w-players',
  templateUrl: './w-players.component.html',
  styleUrls: ['./w-players.component.css']
})
export class WPlayersComponent implements OnInit {
  pTiles = PLAYERTILES;
  constructor() { }
  alive = 100;
  getColors(n: any) {
    let s:number = this.pTiles[n].att+this.pTiles[n].def+this.pTiles[n].farm;
      let r:number;
      let g:number;
      let b:number;
      if (s == 0){
        r = 210;
        g = 210;
        b = 210;
      } else {
        r = 100 + Math.round((this.pTiles[n].att/s)*150);
        g = 100 + Math.round((this.pTiles[n].farm/s)*150);
        b = 100 + Math.round((this.pTiles[n].def/s)*150);
      }
    return(r.toString() + ', ' + g.toString() + ', ' + b.toString());
  }

  ngOnInit() {
    for (let i in this.pTiles) { //zacatek inti
      this.pTiles[i].color = 'rgba(' + this.getColors(i) + ', 0.85)';
   }
  }
  msOver(sID:number){
    this.pTiles[sID].color = 'rgba(' + this.getColors(sID) + ', 0.97)';
  }
  msOut(sID:number){
    this.pTiles[sID].color = 'rgba(' + this.getColors(sID) + ', 0.85)';
  }
}
