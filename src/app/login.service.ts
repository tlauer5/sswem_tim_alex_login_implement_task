import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface LoginResponse {
  login: boolean
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = "http://127.0.0.1:8000/login";
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();


  constructor(private http: HttpClient) {
    const loggedInStatus = localStorage.getItem('loggedIn');
    this._isLoggedIn$.next(!!loggedInStatus)
  }

  async login(username: string, password: string) {
    const data = { username, password };

    try {
      const response: LoginResponse | undefined = await this.http.post<LoginResponse>(this.apiUrl, data).toPromise();
      if(response && response.login) {
        this._isLoggedIn$.next(response.login)
        localStorage.setItem('loggedIn', "1")
        console.log(response.login)
      }

    } catch (error) {
      console.error(error);
    }
  }
}
