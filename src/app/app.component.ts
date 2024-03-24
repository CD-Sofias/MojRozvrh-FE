import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AuthModule} from "./auth/auth.module";
import {registerLicense} from "@syncfusion/ej2-base";
import {environment} from "../environments/environment.prod";
import {NumericTextBoxModule, TextBoxModule} from "@syncfusion/ej2-angular-inputs";
import {DropDownListModule} from "@syncfusion/ej2-angular-dropdowns";
import {CheckBoxModule} from "@syncfusion/ej2-angular-buttons";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {DashboardModule} from "./dashboard/dashboard.module";

registerLicense(environment.registrationKey);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    AuthModule,
    DashboardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    CheckBoxModule,
    DropDownListModule,
    NumericTextBoxModule
  ],
  standalone: true
})
export class AppComponent {
  title = 'MojRozvrh-FE';

}
