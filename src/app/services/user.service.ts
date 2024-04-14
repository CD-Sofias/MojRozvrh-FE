import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {User} from "../types/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.backendUrl + '/users';
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(this.url)
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
