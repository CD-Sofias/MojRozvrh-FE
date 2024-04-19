import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher/teacher.component';
import { FacultyComponent } from './faculty/faculty.component';
import {DepartmentComponent} from "./department/department.component";

const routes: Routes = [
  { path: '', redirectTo: 'teachers', pathMatch: 'full' },
  { path: 'teachers', component: TeacherComponent },
  { path: 'faculties', component: FacultyComponent },
  { path: 'departments', component: DepartmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleTableCreatorRoutingModule { }
