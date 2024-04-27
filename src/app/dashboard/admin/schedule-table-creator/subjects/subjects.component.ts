import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Subject} from "../../../../types/subject";
import {SubjectService} from "../../../../services/subject.service";

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
})
export class SubjectsComponent extends ScheduleTableCreatorComponent {
  subjects: Subject[];
  selectedType: string;

  constructor(private subjectService: SubjectService) {
    super();
  }

  types: string[];

  getSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.data = this.subjects;
    });
  }

  onTypeChange(event: any): void {
    this.selectedType = event.value;
    if (!this.selectedType) {
      console.error('Type is undefined');
    }
  }

  addSubject(subject: { type: string, name: string }): Observable<Subject> {
    const subjectWithId = {id: '', ...subject};
    return this.subjectService.createSubject(subjectWithId);
  }

  editSubject(subjectData: any): Observable<Subject> {
    return this.subjectService.updateSubject(subjectData);
  }

  private getTypes(): void {
    this.subjectService.getTypes().subscribe(types => {
      this.types = types;
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getSubjects();
    this.getTypes();
  }

 actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
  super.actionBegin(args);

  if (args.requestType === 'save') {
    if (args.action === 'add') {
      const subjectData = {
        ...args.data,
        type: this.selectedType
      };
      this.addSubject(subjectData).subscribe({
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
      const subjectData = {
        ...args.data,
        type: this.selectedType
      };
      this.editSubject(subjectData).subscribe({
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
