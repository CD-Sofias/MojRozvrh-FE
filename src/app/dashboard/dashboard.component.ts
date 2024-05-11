import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
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
