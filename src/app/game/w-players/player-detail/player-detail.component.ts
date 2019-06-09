import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerTile } from '../srcPlayers/playerTile';
import { CestyService } from '../../commonServices/cesty.service';
@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  @Output() mySortEvent = new EventEmitter<number>();
  @Input() playerTile: PlayerTile;
  constructor(private cestyService: CestyService) { }
  sortModeLocal : number;
  ascLocal : boolean;
  ngOnInit() {
    this.sortModeLocal = 0;
    this.ascLocal = false;
  }
  getImgPath(aID:number): string {
    return this.cestyService.getAvatarPath(aID);
  }
  btnSortMode(btnID:number) : void{
      this.mySortEvent.next(btnID);
      if (this.sortModeLocal != btnID){
        this.sortModeLocal = btnID;
        this.ascLocal = false;
      } else {
        if (this.ascLocal == true){
          this.ascLocal = false;
        } else {
          this.ascLocal = true;
        }
      }
  }
}
