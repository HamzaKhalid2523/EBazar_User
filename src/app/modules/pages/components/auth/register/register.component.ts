import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/api/users.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  loading = false;
  signupForm: FormGroup;
  statusColor = '#bebcbc';

  enableVerificationCode = false;
  value = 0;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private helperService: HelperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.minLength(4), Validators.email]],
      phone: [ null, [ Validators.required, this.localNumberValidation]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      verificationCode: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.initCodeField();
  }

  localNumberValidation(control: AbstractControl){
      if (!control?.value?.startsWith('923') ) {
        return { phone: true };
      }
      return null;
  }

  initCodeField() {
    let inputRange;
    let maxValue = 100;
    let speed = 2;
    let currValue;
    let rafID;

    const self = this;

    inputRange = document.getElementsByClassName('range')[0];
    inputRange.min = 0;
    inputRange.max = maxValue;

    inputRange.addEventListener('mousedown', unlockStartHandler, false);
    inputRange.addEventListener('mousestart', unlockStartHandler, false);
    inputRange.addEventListener('mouseup', unlockEndHandler, false);
    inputRange.addEventListener('touchend', unlockEndHandler, false);

    function unlockStartHandler() {
      // clear raf if trying again
      window.cancelAnimationFrame(rafID);

      // set to desired value
      currValue = +inputRange.value;
    }

    function unlockEndHandler() {
      currValue = +inputRange.value;

      // determine if we have reached success or not
      if(currValue >= maxValue && self.signupForm.controls.phone.status !== 'INVALID') {
        successHandler();
      }
      else {
          rafID = window.requestAnimationFrame(animateHandler);
      }
    }

    function animateHandler() {
      // update input range
      inputRange.value = currValue;

      // determine if we need to continue
      if(currValue > -1) {
        window.requestAnimationFrame(animateHandler);
      }

      // decrement value
      currValue = currValue - speed;
    }

    function successHandler() {
      self.sendVerificationCode();
    };
  }

  sendVerificationCode() {
    this.usersService.getVerificationCode(this.signupForm.get('phone').value).subscribe(
      (response) => {
        this.enableVerificationCode = true;
        this.helperService.showToast(response?.message);
      },
      (error) => {
        const errorMsg =
          error?.error.Error ||
          error?.detail?._message ||
          error?.error?.message ||
          error?.error?.errmsg ||
          "Something Went Wrong. Server Error!!";
        console.log("error", error, errorMsg);

        this.helperService.showToast(errorMsg, "error");
        this.loading = false;
      }
    );
  }


  submitForm(): void {
    for (const i in this.signupForm.controls) {
      if (i) {
        this.signupForm.controls[i].markAsDirty();
        this.signupForm.controls[i].updateValueAndValidity();
      }
    }
  }

  register() {
    this.submitForm();
    console.log('called');
    if (this.signupForm.valid) {
      this.loading = true;
      const value = this.signupForm.value;

      this.usersService.signupUser(value).subscribe(
        (response) => {
          const tokenData = response.token;
          this.authService.saveLoginToken(tokenData);
          this.authService.saveLoginData(response.user);

          this.loading = false;
          this.helperService.showToast("Log in successfully");
          this.router.navigateByUrl("/").then(() => window.location.reload());
        },
        (error) => {
          const errorMsg =
            error?.error.Error ||
            error?.detail?._message ||
            error?.error?.message ||
            error?.error?.errmsg ||
            "Something Went Wrong. Server Error!!";
          console.log("error", error, errorMsg);

          this.helperService.showToast(errorMsg, "error");

          this.loading = false;
        }
      );
    }
  }

  mouseEnter(div: string) {
    this.statusColor = div;
  }
  mouseLeave(div: string) {
    this.statusColor = div;
  }
}
