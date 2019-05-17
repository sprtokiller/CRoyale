import { Component, OnInit } from '@angular/core';
import { SKILLTILES } from './srcSkills/MOCK_SKILL_TILES';
import { SkillTile } from './srcSkills/skillTile';
@Component({
  selector: 'app-w-upgrades',
  templateUrl: './w-upgrades.component.html',
  styleUrls: ['./w-upgrades.component.css']
})
export class WUpgradesComponent implements OnInit {
  private sTiles = SKILLTILES;
  public sTierTiles: SkillTile[][]; //skill tier, tier in id (0-7, 0-2)
  constructor() { }

  ngOnInit() {
    this.sTierTiles = [];
    for(var i: number = 0; i < ((this.sTiles.length / 3)); i++) {
      this.sTierTiles[i] = [];
  }
    for (let t of this.sTiles) {
      this.sTierTiles[t.tier][t.tierID]=t;
      // console.log(t.skillName);
      // console.log(t.tier);
      // console.log(t.tierID);
    }

  }

}
