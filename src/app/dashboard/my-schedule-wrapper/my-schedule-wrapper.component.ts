import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DashboardModule} from "../dashboard.module";

@Component({
  selector: 'app-my-schedule-wrapper',
  standalone: true,
  imports: [RouterOutlet, DashboardModule],
  templateUrl: './my-schedule-wrapper.component.html',
  styleUrl: './my-schedule-wrapper.component.css'
})
export class MyScheduleWrapperComponent {

}
