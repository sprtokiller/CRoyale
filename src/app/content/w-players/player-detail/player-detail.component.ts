import { Component, OnInit, Input } from '@angular/core';
import { PlayerTile } from '../src/playerTile';
import { CestyService } from '../../../cesty.service';
@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  @Input() playerTile: PlayerTile;
  
  constructor(private cestyService: CestyService) { }

  ngOnInit() {
  }
  getImgPath(aID:number): string {
    return this.cestyService.getAvatarPath(aID);
  }
}
