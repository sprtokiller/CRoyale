import { Component, OnInit, Input } from '@angular/core';
import { SkillTile } from '../srcSkills/skillTile';
import { CestyService } from '../../../cesty.service';

@Component({
  selector: 'app-skill-tile-detail',
  templateUrl: './skill-tile-detail.component.html',
  styleUrls: ['./skill-tile-detail.component.css']
})
export class SkillTileDetailComponent implements OnInit {
  @Input() skill: SkillTile;
  constructor() { }

  isLocked:boolean = false;
  ngOnInit() {
  }

}
