import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-w-clicker',
  templateUrl: './w-clicker.component.html',
  styleUrls: ['./w-clicker.component.css']
})
export class WClickerComponent implements OnInit {

  constructor() { }

  event: MouseEvent;
  clicks = 0;
  posX = null;
  posY = null;
  posXP = null;
  posYP = null;
  posXPs = "NaN";
  posYPs = "Nan";
  divX = 0;
  divY = 0;
  divNextX = 0;
  divNextY = 0;
  divNextXs = "NaN";
  divNextYs = "NaN";
  onClick(event: MouseEvent): void {
  //  this.event = event;
  this.posX = event.clientX;
  this.posY = event.clientY;
  this.divX = document.getElementById("clickerZone").offsetWidth;
  this.divY = document.getElementById("clickerZone").offsetHeight;
  
  this.posXP = (this.posX / this.divX * 100);
  this.posYP = (this.posY / this.divY * 100);

  this.posXPs = this.posXP.toString().substr(0, 5);
  this.posYPs = this.posYP.toString().substr(0, 5);
  this.clicks++;
  //  console.log("Click:" + this.posX.toString() + "x " + this.posY.toString() + "y")
  this.divNextX = Math.random() * 100; 
  this.divNextY = Math.random() * 100;

  this.divNextXs = this.divNextX.toString().substr(0, 5);
  this.divNextYs = this.divNextY.toString().substr(0, 5);
  console.log(event.clientX + " " + event.clientY);
}
  ngOnInit() {
    this.divX = document.getElementById("clickerZone").offsetWidth;
    this.divY = document.getElementById("clickerZone").offsetHeight;

    this.divNextX = Math.random() * 100; 
    this.divNextY = Math.random() * 100;

    this.divNextXs = this.divNextX.toString().substr(0, 5);
    this.divNextYs = this.divNextY.toString().substr(0, 5);
  }
  
}
