import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators';
import {UserService} from "../services/user.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const userService = inject(UserService);

  if (!authService.isAuthenticated()) {
    return router.navigate(['auth/login']);
  }

  return userService.getUsersInfo().pipe(
    map(user => {
      if (user.role === 'ADMIN') {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
