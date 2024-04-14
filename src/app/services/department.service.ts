import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Department} from "../types/department";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  url = environment.backendUrl + "/departments";
  constructor(private http: HttpClient) {}

  getDepartments() {
    return this.http.get<Department[]>(this.url);
  }

  getDepartmentById(id: string) {
    return this.http.get<Department>(`${this.url}/${id}`);
  }

  createDepartment(formData: FormData) {
    const name = formData.get("name") as string;
    return this.http.post(this.url, {name});
  }

  updateDepartment(formData: FormData, id: string) {
    const name = formData.get("name") as string;
    return this.http.put(`${this.url}/${id}`, {name});
  }

  deleteDepartment(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
