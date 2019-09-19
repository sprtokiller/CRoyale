import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { AlertService } from '../../_services/alert.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService,
    ) { }
  fakeReCaptcha: string;
  notMatching: boolean;  
  tooSmallW: boolean;
  tooSmallH: boolean;
  minW: string;
  minH: string;
  rightSize: string;
  marginTB: string;
  registerForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  ngOnInit() {
    this.fakeReCaptcha = null;
    this.notMatching = false;
    this.minW = (0.4 * screen.width).toString() + "px";
    this.minH = (0.7 * screen.height).toString() + "px";
      this.onResize();

      this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        passwordControl: ['', Validators.required],
        captcha: ['', []]
      });
  }
  public get f() { return this.registerForm.controls; }

  resolved(captchaResponse: string) {
    this.fakeReCaptcha = captchaResponse;
  }

  onResize(): void {
    //responz. vyska
    if ((window.innerHeight / screen.height) < 0.71) {
      this.tooSmallH = true;
    } else {
      this.tooSmallH = false;
    }
    //responz sirka
    if ((window.innerWidth / screen.width) < 0.41) {
      this.tooSmallW = true;
    } else {
      this.tooSmallW = false;
    }
    //responz vzdálenost od okraje
    this.rightSize = ((0.30 * screen.width) - (0.5 * (screen.width - window.innerWidth))).toString() + "px";
    this.marginTB = ((window.innerHeight - (0.7 * screen.height)) / 2).toString() + "px";
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted = true;
    if (this.f.password.value != this.f.passwordControl.value) {
      this.notMatching = true;
      return;
    } else {
      this.notMatching = false;
    }
    // stop here if form is invalid
    if ((this.registerForm.invalid) || (this.fakeReCaptcha == null)) {
      return;
    }
    
    this.loading = true;

    this.authenticationService.register("NATIVE", "no-id", this.f.username.value, this.f.password.value)
      .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data.username) {
              this.authenticationService.logout();
              this.authenticationService.login("NATIVE", "no-id", this.f.username.value, this.f.password.value)
              .pipe(first())
              .subscribe(
                data => { //TODO timeout promis rejection error
                  console.log("got data on login");
                  this.router.navigateByUrl('/login');
                },
                error => {
                  console.log("got error on login");
                });
            
          } else if (data.error) {
            this.alertService.setMesseage(data.error, true);
          } else {
            this.alertService.setMesseage("Unknown Error", true);
          }
        },
        error => {
         // console.log(error);
          this.loading = false;
          this.alertService.setMesseage("Unknown Error", true);
        });
  }
}
