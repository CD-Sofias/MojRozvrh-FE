import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ScheduleCell, ScheduleCellCreate} from "../types/scheduleCell";

interface Filter {
  columnName: string;
  value: Object;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleCellService {
  url = environment.backendUrl + '/schedule_cells';

  constructor(private http: HttpClient) {
  }

  getAllScheduleCells() {
    return this.http.get<ScheduleCell[]>(this.url)
  }

  getScheduleCellById(id: string) {
    return this.http.get<ScheduleCell>(`${this.url}/${id}`)
  }

  updateScheduleCell(id: string, scheduleCell: ScheduleCellCreate) {
    return this.http.put<ScheduleCell>(`${this.url}/${id}`, scheduleCell)
  }

  createScheduleCell(scheduleCell: ScheduleCellCreate) {
    return this.http.post<ScheduleCell>(this.url, scheduleCell)
  }

  deleteScheduleCell(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }

  getScheduleCellsByGroupId(groupId: string) {
    return this.http.get<ScheduleCell[]>(`${this.url}/group/${groupId}`)
  }

  getScheduleCellsByFilter(filter: Filter[]) {
    const filterString = filter.map(f => `${f.columnName}=${f.value}`).join('&')
    return this.http.get<ScheduleCell[]>(`${this.url}/filter?${filterString}`)
  }
}
