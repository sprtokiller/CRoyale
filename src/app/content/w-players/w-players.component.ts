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
      this.pTiles[i].color = 'rgb(' + this.getColors(i) + ')';
   }
  }
  msOver(sID:number){
    this.pTiles[sID].color = 'rgb(' + this.getColors(sID) + ')';
  }
  msOut(sID:number){
    this.pTiles[sID].color = 'rgb(' + this.getColors(sID) + ')';
  }
  getAvatarPath(aID:number){
    return("assets/resx/cookie" + aID.toString() + ".png");
  }
}
