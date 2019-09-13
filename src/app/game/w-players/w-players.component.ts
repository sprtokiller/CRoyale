import { Component, OnInit } from '@angular/core';
import { PlayerTile } from './srcPlayers/playerTile';
import { CestyService } from '../commonServices/cesty.service';
import { StatsService } from '../../_services/stats.service';
import { IngamesocketService } from '../../_services/ingamesocket.service';
import { Zprava } from '../w-stats/zprava';

@Component({
  selector: 'app-w-players',
  templateUrl: './w-players.component.html',
  styleUrls: ['./w-players.component.css']
})
export class WPlayersComponent implements OnInit {
  pTiles = [];
  constructor(private cestyService: CestyService, private statsService: StatsService, private socketService: IngamesocketService) { }  //implementace servisu
  alive = 0;
  visible = this.pTiles.length;
  columnCount: string = "3";
  sortMode: number;
  asc: boolean;
  selectedPlayerTile: PlayerTile;
  getColors(n: number) {
    let s: number = this.pTiles[n].att + this.pTiles[n].def + this.pTiles[n].farm;
    let r: number = this.pTiles[n].att;
    let g: number = this.pTiles[n].farm;
    let b: number = this.pTiles[n].def;
    if (s == 0) {
      r = g = b = 210;
    } else {
      let cs = [r, g, b].map(c => ((x: number) => ((x / s) * 100 > 30))(c) ? 210 : 100) //elegance
      r = cs[0], g = cs[1], b = cs[2]
    }
    return (`${r}, ${g}, ${b}`);
  }
  interval: any;

  ngOnInit() {
    //bind services
    this.socketService.onAliveUpdate().subscribe(aliveData => {
      this.alive = aliveData;
    });

    this.socketService.onTileDataUpdate().subscribe(tileData => {
      this.pTiles = tileData;
      for (let i in this.pTiles) { //zacatek inti
        this.pTiles[i].color = 'rgb(' + this.getColors(Number(i)) + ')';
        //  console.log(this.pTiles[i].color);
      }
      this.visible = this.pTiles.length;
      if (this.visible < 7) {
        this.columnCount = "3";
      } else {
        this.columnCount = "5";
      }
    });
    //bind services
    //bind timed ask
    // this.interval = setInterval(() => {
    //    this.checkUpdate();
    //  }, 1000);
    //bind timed ask
    if (!this.pTiles) {
      this.socketService.getGameData(true);
    }
    this.pTiles.sort((a, b) => a.nick > b.nick ? 1 : -1);
    this.sortMode = 0;
    this.asc = false;
    for (let i in this.pTiles) { //zacatek inti
      this.pTiles[i].color = 'rgb(' + this.getColors(Number(i)) + ')';
      //  console.log(this.pTiles[i].color);
    }
    if (this.visible < 7) {
      this.columnCount = "3";
    }
  }
  msOver(sID: number): void {
    this.pTiles[sID].color = 'rgb(' + this.getColors(sID) + ')';
  }
  msOut(sID: number): void {
    this.pTiles[sID].color = 'rgb(' + this.getColors(sID) + ')';
  }
  getImgPath(aID: number): string {
    return this.cestyService.getAvatarPath(aID);
  }

  onSelect(clickedPT: PlayerTile): void {
    if (this.selectedPlayerTile == clickedPT) {
      this.selectedPlayerTile = null;
    } else {
      this.selectedPlayerTile = clickedPT;
      let custMess: Zprava = { id: 1, text: clickedPT.nick, color: "red" };
    }
    console.log(clickedPT.nick);
  }
  sortByName(pTs: PlayerTile[]): PlayerTile[] {
    let answer: PlayerTile[] = pTs;
    let maximum: number;
    let maxIndex: number;
    let maxDef: PlayerTile;
    let k: number = 0;
    //repeat until k = lenght
    for (let k = 0; k < answer.length; k++) {
      maximum = -1;
      for (let i = k; i < answer.length; i++) {
        if (answer[i].farm > maximum) {
          maximum = answer[i].farm;
          maxDef = answer[i];
          maxIndex = i;
        }
      }
      answer[maxIndex] = answer[k];
      answer[k] = maxDef;
    }
    return answer;
  }

  sortMe(sortID: number) {
    console.log(sortID)
    switch (sortID) {
      case 0:
        if (this.sortMode != 0) {
          this.sortMode = 0;
          this.asc = false;
        } else {
          if (this.asc == true) {
            this.asc = false;
          } else {
            this.asc = true;
          }
        }
        if (this.asc == false) {
          ///
          this.pTiles.sort((a, b) => a.nick > b.nick ? 1 : -1);
          ///
        } else {
          this.pTiles.sort((a, b) => b.nick > a.nick ? 1 : -1);
        }
        break;

      case 1:
        if (this.sortMode != 1) {
          this.sortMode = 1;
          this.asc = false;
        } else {
          if (this.asc == true) {
            this.asc = false;
          } else {
            this.asc = true;
          }
        }
        if (this.asc == false) {
          this.pTiles.sort((a, b) => a.def - b.def);
        } else {
          this.pTiles.sort((a, b) => b.def - a.def);
        }
        break;

      case 2:
        if (this.sortMode != 2) {
          this.sortMode = 2;
          this.asc = false;
        } else {
          if (this.asc == true) {
            this.asc = false;
          } else {
            this.asc = true;
          }
        }
        if (this.asc == false) {
          this.pTiles.sort((a, b) => a.att - b.att);
        } else {
          this.pTiles.sort((a, b) => b.att - a.att);
        }
        break;
      case 3:
        if (this.sortMode != 3) {
          this.sortMode = 3;
          this.asc = false;
        } else {
          if (this.asc == true) {
            this.asc = false;
          } else {
            this.asc = true;
          }
        }
        if (this.asc == false) {
          this.pTiles.sort((a, b) => a.farm - b.farm);
        } else {
          this.pTiles.sort((a, b) => b.farm - a.farm);
        }
        break;
    }
  }
}
