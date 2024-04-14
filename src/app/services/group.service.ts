import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Group} from "../types/group";
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

  updateGroup(group: Group) {
    return this.http.put<Group>(`${this.url}/${group.id}`, group)
  }

  createGroup(group: Group) {
    return this.http.post<Group>(this.url, group)
  }

  deleteGroup(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
