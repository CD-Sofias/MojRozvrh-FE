import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ScheduleService} from "../../services/schedule.service";
import {Schedule} from "../../types/schedule";
import {mergeMap, Observable} from "rxjs";
import {DialogUtility} from "@syncfusion/ej2-popups";

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | number[]): string {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value[0], value[1] - 1, value[2], value[3], value[4], value[5], value[6]);
    }

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.css'
})
export class MyScheduleComponent implements OnInit {
  mySchedules: Observable<Schedule[]>;
  public dialogObj;

  public loadMySchedules = (): void => {
    this.mySchedules = this.userService.getUsersInfo().pipe(
      mergeMap((user) => this.scheduleService.getSchedulesByUserId(user.id))
    );

  }

  ngOnInit() {
    this.loadMySchedules();
  }

  constructor(private userService: UserService, private scheduleService: ScheduleService) {
  }
  public confirmBtnClick = (id: string): void => {
    this.dialogObj = DialogUtility.confirm({
      title: ' Delete Schedule',
      content: "Are you sure you want to permanently delete this schedule?",
      okButton: { text: 'Yes', click: this.deleteScheduleCell.bind(this, id)},
      cancelButton: { click: this.confirmCancelAction.bind(this)},
      position: { X: 'center', Y: 'center' },
      closeOnEscape: true
    });
  };
  private confirmCancelAction(): void {
    this.dialogObj.hide();
  }
  deleteScheduleCell(id: string): void {
    this.scheduleService.deleteSchedule(id).subscribe({
      next: () => {
        this.loadMySchedules();
        console.log('Schedule deleted');
        this.dialogObj.hide();
      },
      error: (error) => {
        console.error('Error deleting schedule', error);
      }
    });
  }
}
