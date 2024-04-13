import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  register(userName: string, password: string, email: string): Observable<any> {
    const body = {username: userName, password: password, email: email};
    return this.http.post<any>(environment.backendUrl + '/auth/signup', body, {
      observe: "response"
    }).pipe(
      map(response => {
        if (response.status !== 201) {
          throw new Error('Registration failed');
        }
        return response;
      }),
      catchError((error) => {
        console.error('Server error', error);
        throw new Error('Email or username is already taken');
      })
    );
  }

  login(userName: string, password: string): Observable<any> {
    const body = {username: userName, password: password};
    return this.http.post<any>(environment.backendUrl + '/auth/login', body).pipe(
      map(response => {
        if (!response.accessToken) {
          throw new Error('Invalid token');
        }
        return response;
      }),
      catchError((error) => {
        console.error('Server error', error);
        throw new Error('Invalid password or user name');
      })
    );
  }
}
