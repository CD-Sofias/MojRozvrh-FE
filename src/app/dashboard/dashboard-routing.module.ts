import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyScheduleComponent } from "./schedule/myschedule.component";
import { TeacherComponent } from './admin/schedule-table-creator/teacher/teacher.component';
import { ScheduleTableCreatorComponent } from './admin/schedule-table-creator/schedule-table-creator.component';

const routes: Routes = [
  { path: 'myschedule', component: MyScheduleComponent },
  { path: 'teachers', component: TeacherComponent },
  { path: 'schedule-table-creator', component: ScheduleTableCreatorComponent},
  { path: '', redirectTo: 'schedule-table-creator', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
