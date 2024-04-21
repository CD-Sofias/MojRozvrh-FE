import { Component } from '@angular/core';
import {Address} from "../../../../types/address";

import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Classroom} from "../../../../types/classroom";

import {GridModule} from "@syncfusion/ej2-angular-grids";
import {ToastModule} from "@syncfusion/ej2-angular-notifications";
import {ClassroomService} from "../../../../services/classroom.service";

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [
    GridModule,
    ToastModule
  ],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css'
})
export class ClassroomsComponent extends ScheduleTableCreatorComponent{
  classrooms: Classroom[];

  constructor(private classroomService: ClassroomService) {
    super();
  }

  getClassrooms(): void {
    this.classroomService.getAllClassrooms().subscribe(classrooms => {
      this.classrooms = classrooms;
      this.data = this.classrooms;
    });
  }

  addClassroom(classroom: { capacity: number, type: string, number: number, address: Address, code: string }): Observable<Classroom> {
    const classroomWithId = {id: '', ...classroom};
    return this.classroomService.createClassroom(classroomWithId);
  }

  editClassroom(classroomData: any): Observable<Classroom> {
    return this.classroomService.updateClassroom(classroomData);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getClassrooms();
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.addClassroom(args.data).subscribe({
          next: () => {
            this.getClassrooms();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editClassroom(args.data).subscribe({
          next: () => {
            this.getClassrooms();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      }
    } else if (args.requestType === 'delete') {
      args.cancel = true;
      this.classroomService.deleteClassroom(args.data[0].id).subscribe({
        next: () => {
          this.getClassrooms();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
