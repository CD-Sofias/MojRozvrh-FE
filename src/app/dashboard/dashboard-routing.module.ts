import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyScheduleComponent } from "./schedule/myschedule.component";

const routes: Routes = [
  { path: 'myschedule', component: MyScheduleComponent },
  { path: '', redirectTo: 'myschedule', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
