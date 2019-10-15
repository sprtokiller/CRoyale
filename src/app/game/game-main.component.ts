import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngamesocketService } from './../_services/ingamesocket.service';
import { AuthenticationService } from './../_services/authentication.service'
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-game-main',
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.css']
})
export class GameMainComponent implements OnInit, OnDestroy {

  constructor(
    private socketService: IngamesocketService,
    private router: Router,
    private authService: AuthenticationService

  ) { }
  tooSmallW: boolean;
  tooSmallH: boolean;
  load: boolean;
  ngOnDestroy() {
    this.socketService.disconnect();
  }
  ngOnInit() {
    this.load = false;
    try {
      if (localStorage.getItem('isFromMenu') != '1') {
        this.router.navigateByUrl('/login')
      } else {
        this.load = true;
        localStorage.setItem('isFromMenu', '0');
        this.socketService.connect();
        this.authService.check().pipe(first())
          .subscribe(
            data => {
              if (data.response != "OK") {
                this.socketService.disconnect();
                this.authService.logout();
                this.router.navigateByUrl(data.response);
              }
            },
            error => {
              this.socketService.disconnect();
              this.router.navigateByUrl('/login');
            });
        this.onResize();
      }
    } catch (error) {
      this.router.navigateByUrl('/login');
    }
  }
  onResize(): void {
    //responz. vyska
    if ((window.innerHeight / screen.height) < 0.7) {
      this.tooSmallH = true;
    } else {
      this.tooSmallH = false;
    }
    //responz sirka
    if ((window.innerWidth / screen.width) < 0.70) {
      this.tooSmallW = true;
    } else {
      this.tooSmallW = false;
    }
  }
}
