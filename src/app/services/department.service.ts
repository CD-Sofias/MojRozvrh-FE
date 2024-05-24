import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateDepartment, Department} from "../types/department";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  url = environment.backendUrl + "/departments";

  constructor(private http: HttpClient) {
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.url);
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.url}/${id}`);
  }

  createDepartment(department: CreateDepartment): Observable<Department> {
    return this.http.post<Department>(this.url, department);
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.url}/${department.id}`, department);
  }

  deleteDepartment(id: string): Observable<Object> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
