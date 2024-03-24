import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'dashboard', component: DashboardComponent},
];
