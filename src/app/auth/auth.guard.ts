import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = document.cookie.split(';').find(cookie => cookie.includes('accessToken'));
  if (!token) {
    router.navigate(['auth/login']);
    return false;
  }
  return true;
};
