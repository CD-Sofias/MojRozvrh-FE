import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {CreateGroup, Group} from "../types/group";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  url = environment.backendUrl + '/groups';
  constructor(private http: HttpClient) {}

  getAllGroups() {
    return this.http.get<Group[]>(this.url)
  }
  getGroupById(id: string) {
    return this.http.get<Group>(`${this.url}/${id}`)
  }

  updateGroup(id: string, group: CreateGroup) {
    return this.http.put<Group>(`${this.url}/${id}`, group)
  }

  createGroup(group: CreateGroup) {
    return this.http.post<Group>(this.url, group)
  }

  deleteGroup(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
