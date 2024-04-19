import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {FacultyService} from "../../../../services/faculty.service";
import {Faculty} from "../../../../types/faculty";
import {Observable} from "rxjs";
import {Component} from "@angular/core";

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
})
export class FacultyComponent extends ScheduleTableCreatorComponent {
  faculties: Faculty[];

  constructor(private facultyService: FacultyService) {
    super();
  }

  getFaculties(): void {
    this.facultyService.getAllFaculties().subscribe(faculties => {
      this.faculties = faculties;
      this.data = this.faculties;
    });
  }

  addFaculty(faculty: { name: string }): Observable<Faculty> {
    const facultyWithId = {id: '', ...faculty};
    return this.facultyService.createFaculty(facultyWithId);
  }

  editFaculty(facultyData: any): Observable<Faculty> {
    return this.facultyService.updateFaculty(facultyData);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getFaculties();
  }



  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    if (args.requestType === 'beginEdit') {
      setTimeout(() => {
        const dialog = document.querySelector('.e-dlg-header-content');
        if (dialog) {
          console.log(dialog);
          dialog.querySelector('.e-dlg-header').textContent = `Details of ${args.rowData.name}`;
        }
      }, 0);
    }

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.addFaculty(args.data).subscribe({
          next: response => {
            this.getFaculties();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editFaculty(args.data).subscribe({
          next: response => {
            this.getFaculties();
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
      this.facultyService.deleteFaculty(args.data[0].id).subscribe({
        next: response => {
          this.getFaculties();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
