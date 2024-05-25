import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subject} from "../types/subject";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  url = environment.backendUrl + '/subjects';

  constructor(private http: HttpClient) {
  }

  getAllSubjects() {
    return this.http.get<Subject[]>(this.url)
  }

  getSubjectById(id: string) {
    return this.http.get<Subject>(`${this.url}/${id}`)
  }

  updateSubject(subject: Subject) {
    return this.http.put<Subject>(`${this.url}/${subject.id}`, subject)
  }

  createSubject(subject: Subject) {
    return this.http.post<Subject>(this.url, subject)
  }

  deleteSubject(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }

  getTypes() {
    return this.http.get<string[]>(`${this.url}/types`);
  }
}
