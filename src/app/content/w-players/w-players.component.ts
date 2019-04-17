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
  ngOnInit() {
    for (let i in this.pTiles) { //barvy
      let s:number = this.pTiles[i].att+this.pTiles[i].def+this.pTiles[i].farm;
      let r:number;
      let g:number;
      let b:number;
      if (s == 0){
        r = 230;
        g = 230;
        b = 230;
      } else {
        r = 120 + Math.round((this.pTiles[i].att/s)*120);
        g = 120 + Math.round((this.pTiles[i].farm/s)*120);
        b = 120 + Math.round((this.pTiles[i].def/s)*120);
      }
      this.pTiles[i].color = 'rgb(' + r.toString() + ', ' + g.toString() + ', ' + b.toString() + ')';
      console.log("Styl: " + this.pTiles[i].color);
   }
  }

}
