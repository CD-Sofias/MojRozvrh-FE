import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  register(userName: string, password: string, email: string): void {
    const body = {
      username: userName, password: password, email: email
    };
    this.http.post<any>(environment.backendUrl + '/auth/signup', body).subscribe({
      next: (response) => {
        if (response.message === 'User registration was successful') {
          this.login(userName, password);
        } else {
          console.error('Registration failed');
        }
      },
      error: (error) => {
        console.error('Server error', error);
      }
    });
  }

  login(userName: string, password: string): void {
    const body = {username: userName, password: password};
    this.http.post<any>(environment.backendUrl + '/auth/login', body).subscribe({
      next: (response) => {
        if (response.token) {
          const accessToken = response.token;
          document.cookie = `access_token=${accessToken}; path=/`;
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Invalid token');
        }
      },
      error: (error) => {
        console.error('Server error', error);
      }
    });
  }
}
