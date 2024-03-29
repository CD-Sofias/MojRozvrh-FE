// import {Injectable} from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { environment } from '../../environments/environment.prod';
// import {DialogComponent} from "@syncfusion/ej2-angular-popups";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   dialogObj: DialogComponent | undefined;
//
//   constructor(private http: HttpClient, private router: Router) { }
//
//   setDialog(dialogObj: DialogComponent): void {
//     this.dialogObj = dialogObj;
//   }
//
//   register(userName: string, password: string, email: string): void {
//     const body = {
//       username: userName, password: password, email: email
//     };
//     this.http.post<any>(environment.backendUrl + '/auth/signup', body).subscribe({
//       next: (response) => {
//         if (response.status === 200) {
//           this.login(userName, password);
//         } else {
//           console.error('Registration failed');
//           this.dialogObj!.show();
//         }
//       },
//       error: (error: HttpErrorResponse) => {
//         console.error('Server error', error);
//         this.dialogObj!.show();
//       }
//     });
//   }
//
//   login(userName: string, password: string): void {
//     const body = {username: userName, password: password};
//     this.http.post<any>(environment.backendUrl + '/auth/login', body).subscribe({
//       next: (response) => {
//         if (response.token) {
//           const accessToken = response.token;
//           document.cookie = `access_token=${accessToken}; path=/`;
//           this.router.navigate(['/dashboard']);
//         } else {
//           console.error('Invalid token');
//           this.dialogObj!.show();
//         }
//       },
//       error: (error: HttpErrorResponse) => {
//         console.error('Server error', error);
//         this.dialogObj!.show();
//       }
//     });
//   }
// }
