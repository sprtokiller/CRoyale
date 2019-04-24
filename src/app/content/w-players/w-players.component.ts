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
  constructor() { }  //implementace servisu
  alive = 100;
  selectedPlayerTile: PlayerTile;
  getColors(n: number) {
    let s:number = this.pTiles[n].att+this.pTiles[n].def+this.pTiles[n].farm;
      let r:number = this.pTiles[n].att;
      let g:number = this.pTiles[n].farm;
      let b:number = this.pTiles[n].def;
      if (s == 0){
        r = 210;
        g = 210;
        b = 210;
      } else {
        let cs = [r, g, b].map(c => ((x:number) => ((x/s)*100 > 30))(c) ? 210 : 100) //elegance
        r = cs[0], g = cs[1], b = cs[2]
      }
    return(`${r}, ${g}, ${b}`);
  }

  ngOnInit() {
    for (let i in this.pTiles) { //zacatek inti
      this.pTiles[i].color = 'rgb(' + this.getColors(Number(i)) + ')';
      console.log(this.pTiles[i].color);
   }
  }
  msOver(sID:number) : void{
    this.pTiles[sID].color = 'rgb(' + this.getColors(sID) + ')';
  }
  msOut(sID:number) : void{
    this.pTiles[sID].color = 'rgb(' + this.getColors(sID) + ')';
  }
  getAvatarPath(aID:number) : string{
    return("assets/resx/cookie" + aID.toString() + ".png");
  }
  onSelect(clickedPT:PlayerTile) : void{
    this.selectedPlayerTile = clickedPT;
    console.log(clickedPT.nick);
  }
}
