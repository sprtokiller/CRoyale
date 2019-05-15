import { Component, OnInit } from '@angular/core';
import { SKILLTILES } from './srcSkills/MOCK_SKILL_TILES';
import { SkillTile } from './srcSkills/skillTile';
@Component({
  selector: 'app-w-upgrades',
  templateUrl: './w-upgrades.component.html',
  styleUrls: ['./w-upgrades.component.css']
})
export class WUpgradesComponent implements OnInit {
  sTiles = SKILLTILES;
  constructor() { }

  ngOnInit() {
  }

}
