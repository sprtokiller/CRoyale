import { Component, OnInit } from '@angular/core';
import { IngamesocketService } from './../_services/ingamesocket.service';
import { AuthenticationService } from './../_services/authentication.service'
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-game-main',
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.css']
})
export class GameMainComponent implements OnInit {

  constructor(private socketService: IngamesocketService, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.check().pipe(first())
    .subscribe(
      data => {
        if (data.response != "OK") {
          this.authService.logout();
          this.router.navigateByUrl(data.response);
        } 
      },
      error => {
        this.router.navigateByUrl('/login');
      });

  }

}
