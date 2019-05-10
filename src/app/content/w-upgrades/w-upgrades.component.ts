import { Component, OnInit } from '@angular/core';
import { SKILLTILES } from './srcPlayers/MOCK_SKILL_TILES';
import { PlayerTile } from './srcPlayers/playerTile';
@Component({
  selector: 'app-w-upgrades',
  templateUrl: './w-upgrades.component.html',
  styleUrls: ['./w-upgrades.component.css']
})
export class WUpgradesComponent implements OnInit {
  sTiles = PLAYERTILES;
  constructor() { }

  ngOnInit() {
  }

}
