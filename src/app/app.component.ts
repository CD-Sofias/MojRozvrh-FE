import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AuthModule} from "./auth/auth.module";
import {registerLicense} from "@syncfusion/ej2-base";
import {environment} from "../environments/environment.prod";

registerLicense(environment.registrationKey);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    AuthModule
  ],
  standalone: true
})
export class AppComponent {
  title = 'MojRozvrh-FE';

}
