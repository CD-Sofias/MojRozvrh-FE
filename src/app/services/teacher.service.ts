import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Teacher} from "../types/teacher";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  url = environment.backendUrl + '/teachers';
  constructor(private http: HttpClient) {}

  getAllTeachers() {
    return this.http.get<Teacher[]>(this.url)
  }

  getTeacherById(id: string) {
    return this.http.get<Teacher>(`${this.url}/${id}`)
  }

  updateTeacher(teacher: Teacher) {
    return this.http.put<Teacher>(`${this.url}/${teacher.id}`, teacher)
  }

  createTeacher(teacher: Teacher) {
    return this.http.post<Teacher>(this.url, teacher)
  }

  deleteTeacher(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
