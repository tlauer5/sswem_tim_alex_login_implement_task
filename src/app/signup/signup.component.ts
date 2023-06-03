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


  constructor(
    private router: Router,
    private signupService: SignupService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  async signup() {
    let username = this.signUpForm.value.username;
    let password = this.signUpForm.value.password;
    if (username && password) {
      try {
        const response = await this.signupService.signup(username, password);
        console.log(typeof(response));
        if (response) {
          this.router.navigate(['/login']);
        } else {
          console.log("R");
        }
      } catch (error) {
        console.error(error);
      }
    }

  }

  goToLogin(): void {
    this.router.navigate(['/login']);

  }


}
