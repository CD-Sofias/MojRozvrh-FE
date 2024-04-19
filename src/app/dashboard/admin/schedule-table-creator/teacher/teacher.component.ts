import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {TeacherService} from "../../../../services/teacher.service";
import {Teacher} from "../../../../types/teacher";
import {Observable} from "rxjs";
import {Component} from "@angular/core";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
})
export class TeacherComponent extends ScheduleTableCreatorComponent {
  teachers: Teacher[];

  constructor(private teacherService: TeacherService) {
    super();
  }

  getTeachers(): void {
    this.teacherService.getAllTeachers().subscribe(teachers => {
      this.teachers = teachers;
      this.data = this.teachers;
    });
  }

  addTeacher(teacher: { name: string, surname: string }): Observable<Teacher> {
    const teacherWithId = {id: '', ...teacher};
    return this.teacherService.createTeacher(teacherWithId);
  }

  editTeacher(teacherData: any): Observable<Teacher> {
    return this.teacherService.updateTeacher(teacherData);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getTeachers();
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.addTeacher(args.data).subscribe({
          next: () => {
            this.getTeachers();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editTeacher(args.data).subscribe({
          next: () => {
            this.getTeachers();
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
      this.teacherService.deleteTeacher(args.data[0].id).subscribe({
        next: () => {
          this.getTeachers();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
