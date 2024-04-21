import {ChangeDetectionStrategy, Component, OnInit, Output} from '@angular/core';
import {Subject} from "../types/subject";
import {SubjectService} from "../services/subject.service";
import {Schedule} from "../types/schedule";
import {ScheduleCell} from "../types/scheduleCell";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  public scheduleData: Schedule[] = [];
  public scheduleCells: ScheduleCell[] = [];

  getData(data: ScheduleCell[]): void {
    this.scheduleCells = data;
  }
  ngOnInit(): void {

  }
}
