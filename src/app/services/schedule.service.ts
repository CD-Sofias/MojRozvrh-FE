import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateSchedule, Schedule} from "../types/schedule";
import {ej} from "@syncfusion/ej2-schedule/dist/global";
import schedule = ej.schedule;

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

  createSchedule(schedule: CreateSchedule) {
    return this.http.post<Schedule>(this.url, schedule)
  }

  deleteSchedule(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }

  deleteScheduleCell(id: string, scheduleId: string){
    return this.http.delete(`${this.url}/${id}/schedule_cell`, {
      body: {scheduleId}
    })
  }

  getSchedulesByUserId(id: string) {
    return this.http.get<Schedule[]>(`${this.url}/user/${id}`)
  }
}
