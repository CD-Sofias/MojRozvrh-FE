import {AfterViewInit, Component} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterOutlet, Event} from "@angular/router";
import {AuthModule} from "./auth/auth.module";
import {registerLicense} from "@syncfusion/ej2-base";
import {environment} from "../environments/environment.prod";
import {NumericTextBoxModule, TextBoxModule} from "@syncfusion/ej2-angular-inputs";
import {DropDownListModule} from "@syncfusion/ej2-angular-dropdowns";
import {CheckBoxModule} from "@syncfusion/ej2-angular-buttons";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {DashboardModule} from "./dashboard/dashboard.module";
import {ScheduleTableCreatorModule} from "./dashboard/admin/schedule-table-creator/schedule-table-creator.module";

registerLicense(environment.registrationKey);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    AuthModule,
    DashboardModule,
    ScheduleTableCreatorModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    CheckBoxModule,
    DropDownListModule,
    NumericTextBoxModule,
    NgOptimizedImage,
  ],
  standalone: true
})
export class AppComponent implements AfterViewInit {
  loading = true;
  initialized = false;
  title = 'MojRozvrh-FE';

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.initialized = true;
  }
}
