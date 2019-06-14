import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby-main',
  templateUrl: './lobby-main.component.html',
  styleUrls: ['./lobby-main.component.css']
})
export class LobbyMainComponent implements OnInit {
  constructor() { 
  }

  ngOnInit() {
    console.log("Go away, my code.");
  }

}
