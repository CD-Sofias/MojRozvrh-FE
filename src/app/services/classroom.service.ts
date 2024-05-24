import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Classroom, CreateClassroom, EditClassroom} from "../types/classroom";

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  url = environment.backendUrl + '/classrooms';

  constructor(private http: HttpClient) {
  }

  getAllClassrooms() {
    return this.http.get<Classroom[]>(this.url)
  }

  getClassroomById(id: string) {
    return this.http.get<Classroom>(`${this.url}/${id}`)
  }

  updateClassroom(classroom: EditClassroom) {
    return this.http.put<Classroom>(`${this.url}/${classroom.id}`, classroom)
  }

  createClassroom(classroom: CreateClassroom) {
    return this.http.post<Classroom>(this.url, classroom)
  }

  deleteClassroom(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }

  getClassroomTypes() {
    return this.http.get<string[]>(`${this.url}/types`);
  }
}
