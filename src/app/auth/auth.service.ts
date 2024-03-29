import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    });
  }

  login(userName: string, password: string): Observable<any> {
    const body = {username: userName, password: password};
    return this.http.post<any>(environment.backendUrl + '/auth/login', body);
  }
}
