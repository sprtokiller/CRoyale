import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor() { }
  tooSmallW: boolean;
  tooSmallH: boolean;
  minW: string;
  minH: string;
  rightSize: string;
  marginTB: string;
  ngOnInit() {
    this.minW = (0.5 * screen.width).toString() + "px";
    this.minH = (0.7 * screen.height).toString() + "px";
      this.onResize();
  }
  onResize(): void {
    //responz. vyska
    if ((window.innerHeight / screen.height) < 0.72) {
      this.tooSmallH = true;
    } else {
      this.tooSmallH = false;
    }
    //responz sirka
    if ((window.innerWidth / screen.width) < 0.52) {
      this.tooSmallW = true;
    } else {
      this.tooSmallW = false;
    }
    //responz vzdálenost od okraje
    this.rightSize = ((0.25 * screen.width) - (0.5 * (screen.width - window.innerWidth))).toString() + "px";
    this.marginTB = ((window.innerHeight - (0.7 * screen.height)) / 2).toString() + "px";
  }
}
