import {Routes} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},

];
