import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
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
        username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
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

  onSubmit(): void {
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
    
    console.log(this.f.username.value, this.f.password.value);
    this.loading = true;
    console.log("you shouldnt be here");
    this.authenticationService.register("NATIVE", "no-id", this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
  }
}
