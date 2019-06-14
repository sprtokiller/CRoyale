import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services/authentication.service';
import { AlertService } from '../../_services/alert.service';
import { W_MESSAGES } from './textResxFiles/textResx'
declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  randomWelcome : string;
  tooSmall : boolean;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  full = false;
  scalNum = 1.0;
  scaling = "scale(1.0)";
  minW : string;
  minH : string;
  H45 : string;
  H25: string;
  currentW = "30vw";
  marginSize = "20vw";
  marginTB = "15vh";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    //  if (this.authenticationService.currentUserValue) { //jen zmenit zobrazeni
    //      this.router.navigate(['/']);
    //  }
  }
  elem;

  ngOnInit() {
    //rng text
    this.randomWelcome = W_MESSAGES[Math.floor(Math.random() * W_MESSAGES.length)];
    //prekryti pri male vysce okna
    if ((window.innerHeight / screen.height) < 0.7) {
      this.tooSmall = true;
    } else {
      this.marginTB = ((window.innerHeight - (0.7 * screen.height)) / 2).toString() + "px";
      this.tooSmall = false;
    }

    this.elem = document.documentElement;
    this.minW = (0.24 * screen.width).toString() + "px";
    this.minH = (0.7 * screen.height).toString() + "px";
    this.H45 = (0.45 * screen.height - 10).toString() + "px";
    this.H25 = (0.25* screen.height - 10).toString() + "px";
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
  onResize(event: Event): void {
    //responz. vyska
    if ((window.innerHeight / screen.height) < 0.7) {
      this.tooSmall = true;
    } else {
      this.marginTB = ((window.innerHeight - (0.7 * screen.height)) / 2).toString() + "px";
      this.tooSmall = false;
    }
    //responz sirka
    if ((window.innerWidth / screen.width) < 0.48) {
      this.currentW = this.minW;
      this.marginSize = ((0.16 * screen.width) - ((0.8 * screen.width - window.innerWidth) / 2)).toString() + "px";
      this.scaling = "scale(" + ((window.innerWidth / screen.width) / 0.48).toString() + ")";
    } else
      if ((window.innerWidth / screen.width) < 0.8) {
        this.currentW = this.minW;
        this.marginSize = ((0.16 * screen.width) - ((0.8 * screen.width - window.innerWidth) / 2)).toString() + "px";
        this.scaling = "scale(1.0)";
      } else {
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

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.f.username.value, this.f.password.value);
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
