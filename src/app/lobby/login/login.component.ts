import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { User } from './user';
import { AuthenticationService } from '../../_services/authentication.service';
import { AlertService } from '../../_services/alert.service';
import { UserService } from '../../_services/user.service';
import { W_MESSAGES } from './localResx/textResx';
import { GBTNS } from './localResx/GBTNS';
import { GBtn } from './localResx/gBtn';
import { SBTNS } from './localResx/SBTNS';
import { SBtn } from './localResx/sBtn';
declare var FB: any;


 /* deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers()
    });
  }

  private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }*/

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];

  leftAllowed: boolean = true;
  RP_caption: string = "Play Now"
  localGBTNS: GBtn[] = GBTNS;
  localSBTNS: SBtn[] = SBTNS;
  randomWelcome: string;
  tooSmallW: boolean;
  tooSmallH: boolean;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  full = false;
  scalNum = 1.0;
  scaling = "scale(1.0)";
  minW: string;
  minH: string;
  H45: string;
  H25: string;
  currentW = "30vw";
  marginSize = "20vw";
  marginTB = "15vh";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    // redirect to home if already logged in
    //  if (this.authenticationService.currentUserValue) { //jen zmenit zobrazeni
    //      this.router.navigate(['/']);
    //  }
  }
  elem;

  ngOnInit() {
    //load, popřípadě generování localStorage
    if (!(localStorage.getItem('localGameMode'))) {
      localStorage.setItem('localGameMode', '0');
    };
    if (!(localStorage.getItem('localStyleMode'))) {
      localStorage.setItem('localStyleMode', '0');
    };
    this.onGameModeSelect(Number(localStorage.getItem('localGameMode')))
    this.onStyleModeSelect(Number(localStorage.getItem('localStyleMode')))
    //rng text
    this.randomWelcome = W_MESSAGES[Math.floor(Math.random() * W_MESSAGES.length)];
    //prekryti pri male vysce okna
    this.onResize();

    this.elem = document.documentElement;
    this.minW = (0.24 * screen.width).toString() + "px";
    this.minH = (0.7 * screen.height).toString() + "px";
    this.H45 = (0.45 * screen.height - 10).toString() + "px";
    this.H25 = (0.25 * screen.height - 10).toString() + "px";
    //FB
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '377603336203670',
        cookie: true,
        xfbml: true,
        version: 'v3.3'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //FB


    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }
  onResize(): void {
    //responz. vyska
    if ((window.innerHeight / screen.height) < 0.7) {
      this.tooSmallH = true;
    } else {
      this.marginTB = ((window.innerHeight - (0.7 * screen.height)) / 2).toString() + "px";
      this.tooSmallH = false;
    }
    //responz sirka
    if ((window.innerWidth / screen.width) < 0.30) {
      this.tooSmallW = true;
    } else
    if ((window.innerWidth / screen.width) < 0.48) {
      this.tooSmallW = false;
      this.currentW = this.minW;
      this.marginSize = ((0.16 * screen.width) - ((0.8 * screen.width - window.innerWidth) / 2)).toString() + "px";
      this.scaling = "scale(" + ((window.innerWidth / screen.width) / 0.48).toString() + ")";
    } else
      if ((window.innerWidth / screen.width) < 0.8) {
        this.tooSmallW = false;
        this.currentW = this.minW;
        this.marginSize = ((0.16 * screen.width) - ((0.8 * screen.width - window.innerWidth) / 2)).toString() + "px";
        this.scaling = "scale(1.0)";
      } else {
        this.tooSmallW = false;
        this.currentW = "30vw";
        this.marginSize = "20vw";
        this.scaling = "scale(1.0)";

      }
  }

  scaleMe() {
    this.scalNum = this.scalNum - 0.05;
    this.scaling = "scale(" + this.scalNum.toString() + ")"
  }
  openFullscreen() {
    this.full = true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  logOut() : void{
    this.authenticationService.logout();
  }
  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.f.username.value, this.f.password.value);
    this.loading = true;
    this.authenticationService.login("NATIVE", "no-id", this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
  }
  onGameModeSelect(idX: number): void {
    localStorage.setItem('localGameMode', idX.toString());
    switch (idX) {
      case 0:
        this.localGBTNS[0].selected = true;
        this.localGBTNS[1].selected = false;
        this.localGBTNS[2].selected = false;
        break;

      case 1:
        this.localGBTNS[0].selected = false;
        this.localGBTNS[1].selected = true;
        this.localGBTNS[2].selected = false;
        break;

      case 2:
        this.localGBTNS[0].selected = false;
        this.localGBTNS[1].selected = false;
        this.localGBTNS[2].selected = true;
        break;

      default:
        break;
    }
  }
  onStyleModeSelect(idX: number): void {
    localStorage.setItem('localStyleMode', idX.toString());
    switch (idX) {
      case 0:
        this.localSBTNS[0].selected = true;
        this.localSBTNS[1].selected = false;
        this.localSBTNS[2].selected = false;
        break;

      case 1:
        this.localSBTNS[0].selected = false;
        this.localSBTNS[1].selected = true;
        this.localSBTNS[2].selected = false;
        break;

      case 2:
        this.localSBTNS[0].selected = false;
        this.localSBTNS[1].selected = false;
        this.localSBTNS[2].selected = true;
        break;

      default:
        break;
    }
  }
  onReadyClick(){
    if (this.currentUser) {
      console.log("Y")
    } else {
      console.log("N")
    }

  }
}
