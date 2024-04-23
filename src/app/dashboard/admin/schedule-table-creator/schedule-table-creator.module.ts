import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './teacher/teacher.component';
import { FacultyComponent } from './faculty/faculty.component';
import {GridAllModule} from "@syncfusion/ej2-angular-grids";
import {ToastAllModule} from "@syncfusion/ej2-angular-notifications";
import {ScheduleTableCreatorComponent} from "./schedule-table-creator.component";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import {ScheduleTableCreatorRoutingModule} from "./schedule-table-creator-routing.module";
import {DepartmentComponent} from "./department/department.component";
import {DropDownListAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    TeacherComponent,
    FacultyComponent,
    DepartmentComponent,
    ScheduleTableCreatorComponent
  ],
  imports: [
    CommonModule,
    ScheduleTableCreatorRoutingModule,
    GridAllModule,
    ToastAllModule,
    ButtonModule,
    DropDownListAllModule,
    TextBoxAllModule,
    ReactiveFormsModule
  ],
  exports: [
    TeacherComponent,
    FacultyComponent,
    DepartmentComponent,
    ScheduleTableCreatorComponent
  ]
})
export class ScheduleTableCreatorModule { }
