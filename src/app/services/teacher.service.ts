import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateTeacher, Teacher} from "../types/teacher";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  url = environment.backendUrl + '/teachers';

  constructor(private http: HttpClient) {
  }

  getAllTeachers() {
    return this.http.get<Teacher[]>(this.url)
  }

  getTeacherById(id: string) {
    return this.http.get<Teacher>(`${this.url}/${id}`)
  }

createTeacher(teacher: CreateTeacher) {
  return this.http.post<Teacher>(this.url, teacher).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Unknown error!';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}

updateTeacher(teacher: Teacher) {
  return this.http.put<Teacher>(`${this.url}/${teacher.id}`, teacher).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => new Error(error.error));
    })
  );
}

  deleteTeacher(id: string) {
    return this.http.delete(`${this.url}/${id}`, {
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error));
      })
    );
  }
}
