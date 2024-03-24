import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

import {
  AccordionModule,
  AppBarAllModule, AppBarModule,
  ContextMenuAllModule,
  MenuAllModule,
  ToolbarAllModule,
  ToolbarModule, TreeViewModule
} from "@syncfusion/ej2-angular-navigations";
import {ButtonAllModule, ButtonModule, CheckBoxAllModule, SwitchAllModule} from "@syncfusion/ej2-angular-buttons";
import {DropDownButtonAllModule} from "@syncfusion/ej2-angular-splitbuttons";
import {FormsModule} from "@angular/forms";
import {RecurrenceEditorAllModule, ScheduleAllModule} from "@syncfusion/ej2-angular-schedule";
import {
  MaskedTextBoxModule,
  NumericTextBoxAllModule,
  TextBoxAllModule,
  UploaderAllModule
} from "@syncfusion/ej2-angular-inputs";
import {DatePickerAllModule, DateTimePickerAllModule, TimePickerAllModule} from "@syncfusion/ej2-angular-calendars";
import {AutoCompleteModule, DropDownListAllModule, MultiSelectAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {ToastAllModule} from "@syncfusion/ej2-angular-notifications";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {DashboardComponent} from "./dashboard.component";

@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppBarAllModule, ButtonAllModule, DropDownButtonAllModule, MenuAllModule, ButtonModule, ToolbarModule,
    FormsModule, ScheduleAllModule, RecurrenceEditorAllModule, NumericTextBoxAllModule, TextBoxAllModule, DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule, CheckBoxAllModule, ToolbarAllModule, DropDownListAllModule, ContextMenuAllModule, MaskedTextBoxModule, UploaderAllModule, MultiSelectAllModule, TreeViewModule, ButtonAllModule, DropDownButtonAllModule, SwitchAllModule, ToastAllModule, AppBarModule, AutoCompleteModule, AccordionModule,
    DashboardRoutingModule
  ],
  exports: [
    HeaderComponent,
    DashboardComponent
  ]
})
export class DashboardModule { }
