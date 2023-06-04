import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  private minPasswordLength = 2;

  captcha: string;


  constructor(
    private router: Router,
    private signupService: SignupService,
    private formBuilder: FormBuilder) {
      this.captcha = '';
    }

  ngOnInit(): void {
  }

  async signup() {
    let username = this.signUpForm.value.username;
    let password = this.signUpForm.value.password;
    if (username && password) {

      if (password.length < this.minPasswordLength) {
        alert("Minimal password length: " + this.minPasswordLength)
      } else {
        try {
          const response = await this.signupService.signup(username, password);
          if (response) {
            this.router.navigate(['/login']);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);

  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }


}
