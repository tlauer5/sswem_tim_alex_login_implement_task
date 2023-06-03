import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface SignUpResponse {
  signup: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private apiUrl = "http://127.0.0.1:8000/signup";

  constructor(private http: HttpClient) { }

  async signup(username: string, password: string): Promise<boolean> {
    const data = { username, password };

    try {
      const response: SignUpResponse | undefined = await this.http.post<SignUpResponse>(this.apiUrl, data).toPromise();
      if(response) {
        return response.signup;
      }

    } catch (error) {
      console.error(error);
    }
    return false;
  }
}
