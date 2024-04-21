import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ScheduleService} from "../../services/schedule.service";
import {Schedule} from "../../types/schedule";
import {mergeMap, Observable} from "rxjs";

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.css'
})
export class MyScheduleComponent implements OnInit {
  mySchedules: Observable<Schedule[]>;

  ngOnInit() {
    this.mySchedules = this.userService.getUsersInfo().pipe(
      mergeMap((user) => this.scheduleService.getSchedulesByUserId(user.id))
    );
  }

  constructor(private userService: UserService, private scheduleService: ScheduleService) {
  }
}
