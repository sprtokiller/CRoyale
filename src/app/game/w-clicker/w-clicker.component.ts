import { Component, OnInit } from '@angular/core';
import { IngamesocketService } from './../../_services/ingamesocket.service';

@Component({
  selector: 'app-w-clicker',
  templateUrl: './w-clicker.component.html',
  styleUrls: ['./w-clicker.component.css']
})
export class WClickerComponent implements OnInit {

  constructor(
    private socketService: IngamesocketService
  ) { }
  //event: MouseEvent;
  clicks = 0;
  dimension = 0;
  clickObject = [];
  clickXperc = null;
  clickYperc = null;
  posXPs = "NaN";
  posYPs = "Nan";
  divNextX = 50;
  divNextY = 50;
  divNextXs = "50%";
  divNextYs = "50%";
  hit = "?";
  distS = "?";
  tl = "30%";
  tt = "30%";
  tw = "20%";
  th = "20%";
  onClick(event: MouseEvent): void {

  this.clickXperc = (event.clientX / this.dimension * 100);
  this.clickYperc = (event.clientY / this.dimension * 100);

  this.clickObject.push({ //TO-DO: posílat cyklicky po cca 100ms / při nákupu, po odeslání vyprázdnit. Server vždy kontroluje "reálnost"
  c : {
    x : this.clickXperc,
    y : this.clickYperc
  },
  t : {
    x : this.divNextX,
    y : this.divNextY
  }
});

  this.clicks++;

  this.setDebugStrings1();
  if (Math.pow(this.clickXperc - this.divNextX, 2) + Math.pow(this.clickYperc - this.divNextY, 2) <= 400) {
    this.hit = "YES";
  } else {
    this.hit = "NO";
  }
  
  this.divNextX = Math.random() * 80 + 10; 
  this.divNextY = Math.random() * 80 + 10;

  this.setDebugStrings2();
} 

  ngOnInit() {
    this.setDimension();
  }

  onResize(): void {
    this.setDimension();
  }

  setDimension(): void{
    this.dimension = window.innerWidth * 0.3333332;
  }

  setDebugStrings1(): void{
    this.posXPs = this.clickXperc.toString().substr(0, 5);
    this.posYPs = this.clickYperc.toString().substr(0, 5);
    this.distS = (Math.pow(this.clickXperc - this.divNextX, 2) + Math.pow(this.clickYperc - this.divNextY, 2)).toString().substr(0, 7);
  }

  setDebugStrings2(): void{

    this.divNextXs = this.divNextX.toString().substr(0, 5);
    this.divNextYs = this.divNextY.toString().substr(0, 5);
    this.tl = (this.divNextX - 10).toString().substr(0, 5) + "%";
    this.tt = (this.divNextY - 10).toString().substr(0, 5) + "%";

  }

  sendClickObject(): void{
    this.socketService.sendClicks(this.clickObject);
    this.clickObject = [];
  }
}
