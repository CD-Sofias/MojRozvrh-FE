import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeacherComponent} from './teacher/teacher.component';
import {FacultyComponent} from './faculty/faculty.component';
import {GridAllModule} from "@syncfusion/ej2-angular-grids";
import {ToastAllModule} from "@syncfusion/ej2-angular-notifications";
import {ScheduleTableCreatorComponent} from "./schedule-table-creator.component";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import {ScheduleTableCreatorRoutingModule} from "./schedule-table-creator-routing.module";
import {DepartmentComponent} from "./department/department.component";
import {DropDownListAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {NumericTextBoxAllModule, TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {ReactiveFormsModule} from "@angular/forms";
import {AddressesComponent} from "./addresses/addresses.component";
import {ClassroomsComponent} from "./classrooms/classrooms.component";
import {SubjectsComponent} from "./subjects/subjects.component";

@NgModule({
  declarations: [
    TeacherComponent,
    FacultyComponent,
    DepartmentComponent,
    ScheduleTableCreatorComponent,
    AddressesComponent,
    ClassroomsComponent,
    SubjectsComponent
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
    NumericTextBoxAllModule
  ],
  exports: [
    TeacherComponent,
    ClassroomsComponent,
    FacultyComponent,
    DepartmentComponent,
    ScheduleTableCreatorComponent,
    AddressesComponent,
    SubjectsComponent
  ]
})
export class ScheduleTableCreatorModule {
}
