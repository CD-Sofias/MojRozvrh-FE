import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {authGuard} from "./auth/auth.guard";
import {MyScheduleComponent} from "./dashboard/my-schedule/my-schedule.component";
import {MyScheduleDetailComponent} from "./dashboard/my-schedule-detail/my-schedule-detail.component";

export const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {path: 'my-schedule', component: MyScheduleComponent},
      {path: 'my-schedule/:id', component: MyScheduleDetailComponent}
    ]
  },
];
