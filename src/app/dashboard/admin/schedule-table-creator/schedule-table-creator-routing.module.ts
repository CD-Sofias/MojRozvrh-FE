import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher/teacher.component';
import { FacultyComponent } from './faculty/faculty.component';
import {DepartmentComponent} from "./department/department.component";
import {AddressesComponent} from "./addresses/addresses.component";
import {GroupsComponent} from "./groups/groups.component";
import {ClassroomsComponent} from "./classrooms/classrooms.component";
import {SubjectsComponent} from "./subjects/subjects.component";

const routes: Routes = [
  { path: 'teachers', component: TeacherComponent },
  { path: '', redirectTo: 'teachers', pathMatch: 'full' },
  { path: 'faculties', component: FacultyComponent },
  { path: 'departments', component: DepartmentComponent },
  { path: 'addresses', component: AddressesComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'classrooms', component: ClassroomsComponent },
  { path: 'subjects', component: SubjectsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleTableCreatorRoutingModule { }
