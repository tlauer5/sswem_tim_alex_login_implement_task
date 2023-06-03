import { Component, OnInit } from '@angular/core';
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


  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  async login() {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    if (username && password){
       await this.loginService.login(username, password);
       this.router.navigate(['/landing-page']);

    }

  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

}
