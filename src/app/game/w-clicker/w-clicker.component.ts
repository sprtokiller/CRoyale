import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-w-clicker',
  templateUrl: './w-clicker.component.html',
  styleUrls: ['./w-clicker.component.css']
})
export class WClickerComponent implements OnInit {

  constructor() { }
  //event: MouseEvent;
  clicks = 0;
  dimension = 0;

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
  onClick(event: MouseEvent): void {
  //this.event = event
  this.clickXperc = (event.clientX / this.dimension * 100);
  this.clickYperc = (event.clientY / this.dimension * 100);

  this.clicks++;

  this.setDebugStrings1();
  if (Math.pow(this.clickXperc - this.divNextX, 2) + Math.pow(this.clickYperc - this.divNextY, 2) <= 400) {
    this.hit = "YES";
  } else {
    this.hit = "NO";
  }

  this.divNextX = Math.random() * 100; 
  this.divNextY = Math.random() * 100;

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
  }
}
