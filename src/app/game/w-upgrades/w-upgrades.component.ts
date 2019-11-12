import { Component, OnInit, HostListener } from '@angular/core';
import { SKILLTILES } from './srcSkills/MOCK_SKILL_TILES';
import { SkillTile } from './srcSkills/skillTile';
import { StatsService } from 'src/app/_services/stats.service';
import { Zprava } from '../../game/w-stats/zprava';

export enum KEY_CODE {
  SHIFT = 16,
  CTRL = 17
}

@Component({
  selector: 'app-w-upgrades',
  templateUrl: './w-upgrades.component.html',
  styleUrls: ['./w-upgrades.component.css']
})
export class WUpgradesComponent implements OnInit {
  private sTiles : SkillTile[] = SKILLTILES;
  public sTierTiles : SkillTile[][]; //skill tier, tier in id (0-7, 0-2)
  private buyStatus : number = 1; //kolik se kupuje najednou  - bud rucne, nebo pres keys
  private CTRLkeysPressed : number = 0;
  private SHIFTkeysPressed : number = 0;
  constructor(private statsService: StatsService) { }

  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent) {
   
    if (event.keyCode === KEY_CODE.SHIFT) { //TO-DO: returns to 1/10
      this.SHIFTkeysPressed--;
      let test2: Zprava = {id: this.statsService.nextID, text: "Shift Up", color: "yellow"};
      this.statsService.pushMsg(test2);
    }

    if (event.keyCode === KEY_CODE.CTRL) {
      this.CTRLkeysPressed--;
      let test2: Zprava = {id: this.statsService.nextID, text: "Ctrl Up", color: "yellow"};
      this.statsService.pushMsg(test2);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEventDown(event: KeyboardEvent) {
    
    if (event.keyCode === KEY_CODE.SHIFT) {
      if (this.buyStatus == 0) {this.buyStatus = 10; //dont care if already 10/100
        let mes10: Zprava = {id: this.statsService.nextID, text: "Change to 10", color: "yellow"};
        this.statsService.pushMsg(mes10);
      }
      this.SHIFTkeysPressed++;
    }

    if (event.keyCode === KEY_CODE.CTRL) {
      if ((this.buyStatus == 0) || (this.buyStatus == 10)) {this.buyStatus = 100; //dont care if already 100
        let mes100: Zprava = {id: this.statsService.nextID, text: "Change to 100", color: "yellow"};
        this.statsService.pushMsg(mes100);
      }
      this.CTRLkeysPressed++;
    }
  }

  ngOnInit() {
    this.sTierTiles = [];
    for(var i: number = 0; i < ((this.sTiles.length / 3)); i++) {
      this.sTierTiles[i] = [];
     }
    for (let t of this.sTiles) {
      this.sTierTiles[t.tier][t.tierID]=t;
    }
  }
  buttPress(){
    let test1: Zprava = {id: this.statsService.nextID, text: "Go fucking kys", color: "pink"};
    this.statsService.pushMsg(test1);
    console.log(test1.text);
  }

}
