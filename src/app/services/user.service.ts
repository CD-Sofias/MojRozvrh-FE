import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';
import {User} from "../types/user";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.backendUrl + '/users';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers() {
    return this.http.get<User[]>(this.url)
  }
  logout() {
    return this.http.get(environment.backendUrl + '/logout').subscribe(() => {
      this.authService.deleteAuthToken();
    })
  }

  getUsersInfo() {
    return this.http.get<User>(this.url + '/info')
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.url}/${id}`)
  }

  updateUser(user: User) {
    return this.http.put<User>(`${this.url}/${user.id}`, user)
  }

  createUser(user: User) {
    return this.http.post<User>(this.url, user)
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
