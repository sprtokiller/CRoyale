import { Component, OnInit } from '@angular/core';
import { SKILLTILES } from './srcSkills/MOCK_SKILL_TILES';
import { SkillTile } from './srcSkills/skillTile';
import { StatsService } from 'src/app/_services/stats.service';
import { Zprava } from '../../game/w-stats/zprava';
@Component({
  selector: 'app-w-upgrades',
  templateUrl: './w-upgrades.component.html',
  styleUrls: ['./w-upgrades.component.css']
})
export class WUpgradesComponent implements OnInit {
  private sTiles : SkillTile[] = SKILLTILES;

  public sTierTiles: SkillTile[][]; //skill tier, tier in id (0-7, 0-2)
  constructor(private statsService: StatsService) { }

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
