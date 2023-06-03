import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  correctPassword: boolean,
  registered: boolean
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = "http://127.0.0.1:8000/login";
  public isLoggedIn$: boolean = false;


  constructor(private http: HttpClient) {
  }

  async login(username: string, password: string): Promise<boolean> {
    const data = { username, password };

    try {
      const response: LoginResponse | undefined = await this.http.post<LoginResponse>(this.apiUrl, data).toPromise();

      if(response && response.correctPassword && response.registered) {
        this.isLoggedIn$ = true
        return true
      } else if (response && !response.correctPassword && !response.registered) {
        alert("Please register first")
      } else if (response && !response.correctPassword && response.registered) {
        alert("False password")
      }


    } catch (error) {
      console.error(error);
    }
    return false
  }
}
