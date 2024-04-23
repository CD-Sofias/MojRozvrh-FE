import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {MyScheduleComponent} from './schedule/myschedule.component';
import {
  AccordionModule,
  AppBarAllModule,
  AppBarModule,
  ContextMenuAllModule,
  MenuAllModule,
  ToolbarAllModule,
  ToolbarModule,
  TreeViewModule
} from "@syncfusion/ej2-angular-navigations";
import {ButtonAllModule, ButtonModule, CheckBoxAllModule, SwitchAllModule} from "@syncfusion/ej2-angular-buttons";
import {DropDownButtonAllModule} from "@syncfusion/ej2-angular-splitbuttons";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RecurrenceEditorAllModule, ScheduleAllModule} from "@syncfusion/ej2-angular-schedule";
import {
  MaskedTextBoxModule,
  NumericTextBoxAllModule,
  TextBoxAllModule,
  UploaderAllModule
} from "@syncfusion/ej2-angular-inputs";
import {
  DatePickerAllModule,
  DatePickerModule,
  DateTimePickerAllModule,
  TimePickerAllModule
} from "@syncfusion/ej2-angular-calendars";
import {
  AutoCompleteModule,
  DropDownListAllModule,
  DropDownListModule,
  MultiSelectAllModule
} from "@syncfusion/ej2-angular-dropdowns";
import {ToastAllModule, ToastModule} from "@syncfusion/ej2-angular-notifications";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {DashboardComponent} from "./dashboard.component";

import {GridModule} from "@syncfusion/ej2-angular-grids";
import {HttpClientModule} from "@angular/common/http";
import {ScheduleTableCreatorModule} from "./admin/schedule-table-creator/schedule-table-creator.module";
import {GroupsComponent} from "./groups/groups.component";

@NgModule({
  declarations: [
    HeaderComponent,
    MyScheduleComponent,
    DashboardComponent,
    GroupsComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScheduleTableCreatorModule,
    ReactiveFormsModule,
    RouterModule,
    AppBarAllModule, ButtonAllModule, DropDownButtonAllModule, MenuAllModule, ButtonModule, ToolbarModule,
    FormsModule, ScheduleAllModule, RecurrenceEditorAllModule, NumericTextBoxAllModule, TextBoxAllModule, DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule, CheckBoxAllModule, ToolbarAllModule, DropDownListAllModule, ContextMenuAllModule, MaskedTextBoxModule, UploaderAllModule, MultiSelectAllModule, TreeViewModule, ButtonAllModule, DropDownButtonAllModule, SwitchAllModule, ToastAllModule, AppBarModule, AutoCompleteModule, AccordionModule,
    DashboardRoutingModule, DropDownListModule, DatePickerModule, GridModule, AutoCompleteModule, HttpClientModule, ToastModule
  ],
  exports: [
    HeaderComponent,
    MyScheduleComponent,
    DashboardComponent,
    GroupsComponent
  ]
})
export class DashboardModule {
}
