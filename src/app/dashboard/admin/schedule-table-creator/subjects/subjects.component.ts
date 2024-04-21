import { Component } from '@angular/core';
import {GridModule} from "@syncfusion/ej2-angular-grids";
import {ToastModule} from "@syncfusion/ej2-angular-notifications";
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Subject} from "../../../../types/subject";
import {SubjectService} from "../../../../services/subject.service";

@Component({
  selector: 'app-subjects',
  standalone: true,
    imports: [
        GridModule,
        ToastModule
    ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent extends ScheduleTableCreatorComponent{
  subjects: Subject[];

  constructor(private subjectService: SubjectService) {
    super();
  }

  getSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.data = this.subjects;
    });
  }

  addSubject(subject: { type: string, name: string }): Observable<Subject> {
    const subjectWithId = {id: '', ...subject};
    return this.subjectService.createSubject(subjectWithId);
  }

  editSubject(subjectData: any): Observable<Subject> {
    return this.subjectService.updateSubject(subjectData);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getSubjects();
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.addSubject(args.data).subscribe({
          next: () => {
            this.getSubjects();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editSubject(args.data).subscribe({
          next: () => {
            this.getSubjects();
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
      this.subjectService.deleteSubject(args.data[0].id).subscribe({
        next: () => {
          this.getSubjects();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
