import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Faculty} from "../types/faculty";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  url = environment.backendUrl + '/faculties';
  constructor(private http: HttpClient) {}

  getAllFaculties() {
    return this.http.get<Faculty[]>(this.url)
  }

  getFacultyById(id: string) {
    return this.http.get<Faculty>(`${this.url}/${id}`)
  }

  updateFaculty(faculty: Faculty) {
    return this.http.put<Faculty>(`${this.url}/${faculty.id}`, faculty)
  }

  createFaculty(faculty: Faculty) {
    return this.http.post<Faculty>(this.url, faculty)
  }

  deleteFaculty(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
