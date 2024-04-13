import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {Schedule} from "../types/schedule";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  url = environment.backendUrl + '/schedules';
  constructor(private http: HttpClient) {}

  getAllSchedules() {
    return this.http.get<Schedule[]>(this.url)
  }

  getScheduleById(id: string) {
    return this.http.get<Schedule>(`${this.url}/${id}`)
  }

  updateSchedule(schedule: Schedule) {
    return this.http.put<Schedule>(`${this.url}/${schedule.id}`, schedule)
  }

  createSchedule(schedule: Schedule) {
    return this.http.post<Schedule>(this.url, schedule)
  }

  deleteSchedule(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
