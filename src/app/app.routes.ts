import {Routes} from '@angular/router';
import {authGuard} from "./auth/auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TeacherComponent} from "./dashboard/admin/schedule-table-creator/teacher/teacher.component";
import {FacultyComponent} from "./dashboard/admin/schedule-table-creator/faculty/faculty.component";
import {DepartmentComponent} from "./dashboard/admin/schedule-table-creator/department/department.component";
import {AddressesComponent} from "./dashboard/admin/schedule-table-creator/addresses/addresses.component";
import {GroupsComponent} from "./dashboard/admin/schedule-table-creator/groups/groups.component";
import {ClassroomsComponent} from "./dashboard/admin/schedule-table-creator/classrooms/classrooms.component";
import {SubjectsComponent} from "./dashboard/admin/schedule-table-creator/subjects/subjects.component";
import {ScheduleTableCreatorComponent} from "./dashboard/admin/schedule-table-creator/schedule-table-creator.component";
import {MyScheduleComponent} from "./dashboard/my-schedule/my-schedule.component";
import {MyScheduleDetailComponent} from "./dashboard/my-schedule-detail/my-schedule-detail.component";
import {MyScheduleWrapperComponent} from "./dashboard/my-schedule-wrapper/my-schedule-wrapper.component";
import {myScheduleResolver} from "./my-schedule.resolver";
import {ScheduleComponent} from "./dashboard/schedule/schedule.component";
import {ScheduleCellComponent} from "./dashboard/admin/schedule-table-creator/schedule-cell/schedule-cell.component";

export const routes: Routes = [
  {path: '', redirectTo: 'schedule', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'schedule', component: ScheduleComponent
  },
  {
    path: 'my-schedule',
    component: MyScheduleWrapperComponent,
    children: [
      {path: '', component: MyScheduleComponent},
      {path: ':id', resolve: {schedule: myScheduleResolver}, component: MyScheduleDetailComponent},
    ]
  },
  {
    path: 'admin-panel', canActivate: [authGuard], component: ScheduleTableCreatorComponent, children: [
      {path: '', redirectTo: 'teachers', pathMatch: 'full'},
      {path: 'teachers', component: TeacherComponent},
      {path: 'faculties', component: FacultyComponent},
      {path: 'departments', component: DepartmentComponent},
      {path: 'addresses', component: AddressesComponent},
      {path: 'groups', component: GroupsComponent},
      {path: 'classrooms', component: ClassroomsComponent},
      {path: 'subjects', component: SubjectsComponent},
      {path: 'schedule-cell', component: ScheduleCellComponent},
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], children: []
  },
];
