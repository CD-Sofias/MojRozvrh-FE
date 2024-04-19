import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./auth/auth.service";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {throwError} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAuthToken()

  if (!token) {
    router.navigate(['auth/login']);
    return next(req);
  }
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  })
  return next(authReq).pipe(catchError(err => {
    if (err.status === 401) {
      authService.deleteAuthToken();
      router.navigate(['auth/login']);
    }
    return next(authReq);
  }))
};
