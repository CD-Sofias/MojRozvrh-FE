import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ScheduleComponent } from './schedule/schedule.component';
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
import {ToastAllModule} from "@syncfusion/ej2-angular-notifications";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {DashboardComponent} from "./dashboard.component";
import {GroupsComponent} from "./groups/groups.component";
import {GridModule} from "@syncfusion/ej2-angular-grids";
import {HttpClientModule} from "@angular/common/http";
import {CreateScheduleModalComponent} from "./create-schedule-modal/create-schedule-modal.component";
import {DialogModule} from "@syncfusion/ej2-angular-popups";
import {MyScheduleComponent} from "./my-schedule/my-schedule.component";
import {SearchComponent} from "./search/search.component";
import {MyScheduleDetailComponent} from "./my-schedule-detail/my-schedule-detail.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@NgModule({
  declarations: [
    HeaderComponent,
    ScheduleComponent,
    GroupsComponent,
    DashboardComponent,
    MyScheduleComponent,
    CreateScheduleModalComponent,
    MyScheduleDetailComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppBarAllModule, ButtonAllModule, DropDownButtonAllModule, MenuAllModule, ButtonModule, ToolbarModule,
    FormsModule, ScheduleAllModule, RecurrenceEditorAllModule, NumericTextBoxAllModule, TextBoxAllModule, DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule, CheckBoxAllModule, ToolbarAllModule, DropDownListAllModule, ContextMenuAllModule, MaskedTextBoxModule, UploaderAllModule, MultiSelectAllModule, TreeViewModule, ButtonAllModule, DropDownButtonAllModule, SwitchAllModule, ToastAllModule, AppBarModule, AutoCompleteModule, AccordionModule,
    DashboardRoutingModule, DropDownListModule, DatePickerModule, GridModule, AutoCompleteModule, HttpClientModule, DialogModule, MatSelect, MatDialogContent, MatDialogActions, MatOption, MatButton, MatDialogTitle,
  ],
  exports: [
    HeaderComponent,
    ScheduleComponent,
    GroupsComponent,
    DashboardComponent,
    MyScheduleComponent,
    CreateScheduleModalComponent,
    MyScheduleDetailComponent,
    SearchComponent,
  ]
})
export class DashboardModule { }
