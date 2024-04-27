import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {authGuard} from "./auth/auth.guard";
import {MyScheduleComponent} from "./dashboard/my-schedule/my-schedule.component";
import {MyScheduleDetailComponent} from "./dashboard/my-schedule-detail/my-schedule-detail.component";
import {myScheduleResolver} from "./my-schedule.resolver";
import {MyScheduleWrapperComponent} from "./dashboard/my-schedule-wrapper/my-schedule-wrapper.component";
import {ScheduleComponent} from "./dashboard/schedule/schedule.component";

export const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'dashboard', canActivate: [authGuard], loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  {
    path: 'my-schedule',
    canActivate: [authGuard],
    component: MyScheduleWrapperComponent,
    children: [
      {path: '', component: MyScheduleComponent},
      {path: ':id', resolve: {schedule: myScheduleResolver}, component: MyScheduleDetailComponent},
    ]
  },
  {path: 'schedule', canActivate: [authGuard], component: ScheduleComponent},
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [authGuard],
  // },
];
