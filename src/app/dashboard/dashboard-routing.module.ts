import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from "./schedule/schedule.component";
import {MyScheduleComponent} from "./my-schedule/my-schedule.component";

const routes: Routes = [
  // { path: 'schedule', component: ScheduleComponent },
  // { path: '', redirectTo: 'myschedule', pathMatch: 'full' },
  { path: 'myschedule', component: MyScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
