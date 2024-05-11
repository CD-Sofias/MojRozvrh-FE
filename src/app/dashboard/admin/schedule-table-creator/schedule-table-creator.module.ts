import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeacherComponent} from './teacher/teacher.component';
import {FacultyComponent} from './faculty/faculty.component';
import {GridAllModule, GridModule} from "@syncfusion/ej2-angular-grids";
import {ToastAllModule} from "@syncfusion/ej2-angular-notifications";
import {ScheduleTableCreatorComponent} from "./schedule-table-creator.component";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import {ScheduleTableCreatorRoutingModule} from "./schedule-table-creator-routing.module";
import {DepartmentComponent} from "./department/department.component";
import {DropDownListAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {NumericTextBoxAllModule, TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AddressesComponent} from "./addresses/addresses.component";
import {ClassroomsComponent} from "./classrooms/classrooms.component";
import {SubjectsComponent} from "./subjects/subjects.component";
import {DashboardModule} from "../../dashboard.module";
import {ScheduleCellComponent} from "./schedule-cell/schedule-cell.component";
import {DateTimePickerModule} from "@syncfusion/ej2-angular-calendars";
import {ScheduleModule} from "@syncfusion/ej2-angular-schedule";
import {SearchComponent} from "../../search/search.component";

@NgModule({
  declarations: [
    TeacherComponent,
    FacultyComponent,
    DepartmentComponent,
    ScheduleTableCreatorComponent,
    AddressesComponent,
    SubjectsComponent,
    ScheduleCellComponent,
    ClassroomsComponent,
    ],
  imports: [
    CommonModule,
    ScheduleTableCreatorRoutingModule,
    GridAllModule,
    ToastAllModule,
    ButtonModule,
    DropDownListAllModule,
    TextBoxAllModule,
    ReactiveFormsModule,
    NumericTextBoxAllModule,
    DashboardModule,
    DateTimePickerModule,
    FormsModule,
    ScheduleModule,
    GridModule,
  ],
  exports: [
  ]
})
export class ScheduleTableCreatorModule {
}
