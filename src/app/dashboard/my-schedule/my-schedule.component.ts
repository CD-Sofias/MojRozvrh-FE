import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ScheduleService} from "../../services/schedule.service";
import {Schedule} from "../../types/schedule";

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.css'
})
export class MyScheduleComponent {
  constructor(private userService: UserService, private scheduleService: ScheduleService) {
  }
  userID: string;
  mySchedules: Schedule[];

  ngOnInit(): void {
    this.userService.getUsersInfo().subscribe(user => {
      this.scheduleService.getSchedulesByUserId(user.id).subscribe(schedules => {
        this.userID = user.id;
        this.mySchedules = schedules;
        // console.log(this.mySchedules);
      });
    });
  }
}
