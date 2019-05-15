import { Component, OnInit, Input } from '@angular/core';
import { SkillTile } from '../srcSkills/skillTile';
import { CestyService } from '../../../cesty.service';
@Component({
  selector: 'app-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.css']
})
export class SkillDetailComponent implements OnInit {
  @Input() skill: SkillTile;
  
  constructor() { }

  isLocked:boolean = false;

  ngOnInit() {
  }

}
