import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {authGuard} from "./auth/auth.guard";
import {NgModule} from "@angular/core";
import {TeacherComponent} from "./dashboard/admin/schedule-table-creator/teacher/teacher.component";
import {FacultyComponent} from "./dashboard/admin/schedule-table-creator/faculty/faculty.component";
import {DepartmentComponent} from "./dashboard/admin/schedule-table-creator/department/department.component";

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], children: [
      { path: 'teachers', component: TeacherComponent },
      { path: 'faculties', component: FacultyComponent },
      { path: 'departments', component: DepartmentComponent }
    ]},
];
