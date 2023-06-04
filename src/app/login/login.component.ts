import { Component, OnInit, createPlatform } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  captcha: string;


  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder) {
      this.captcha = '';
     }

  ngOnInit(): void {
  }

  async login() {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    if (username && password){
       if(await this.loginService.login(username, password)){
        this.router.navigate(['/landing-page']);
       }

    }

  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }

}
