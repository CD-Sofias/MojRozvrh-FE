import {Component, Input, OnInit} from '@angular/core';
import {Schedule} from "../../types/schedule";
import {ScheduleService} from "../../services/schedule.service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-my-schedule-detail',
  templateUrl: './my-schedule-detail.component.html',
  styleUrl: './my-schedule-detail.component.css'
})
export class MyScheduleDetailComponent implements OnInit {

  schedule: Observable<Schedule>;

  constructor(private service: ScheduleService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.schedule = this.service.getScheduleById(params.id)
    });
    console.log(this.schedule.subscribe(data => console.log(data)))
  }

}
