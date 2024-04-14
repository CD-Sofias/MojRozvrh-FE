import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./auth/auth.service";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

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
  console.log(authReq)
  return next(authReq).pipe(catchError(err => {
    if (err.status === 401) {
      authService.deleteAuthToken();
    }
    throw new Error(err.error.message || err.statusText)
  }))
};