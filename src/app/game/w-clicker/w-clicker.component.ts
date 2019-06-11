import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-w-clicker',
  templateUrl: './w-clicker.component.html',
  styleUrls: ['./w-clicker.component.css']
})
export class WClickerComponent implements OnInit {

  constructor() { }

  event: MouseEvent;
  posX = 0;
  posY = 0;
  divNextX = 0;
  divNextY = 0;
  onClick(event: MouseEvent): void {
  //  this.event = event;
  //  this.posX = event.clientX;
  //  this.posY = event.clientY;
  //  console.log("Click:" + this.posX.toString() + "x " + this.posY.toString() + "y")
  this.divNextX = Math.random() * 100; 
  this.divNextY = Math.random() * 100; 

}
  ngOnInit() {
    document.getElementById("canvas");
  }
  
}
