import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Department} from "../../../../types/department";
import {Observable} from "rxjs";
import {Component} from "@angular/core";
import {DepartmentService} from "../../../../services/department.service";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent extends ScheduleTableCreatorComponent {
  departments: Department[];

  constructor(private departmentService: DepartmentService) {
    super();
  }

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
      this.data = this.departments;
    });
  }

  addDepartment(department: { name: string, facultyId: string }): Observable<Department> {
    const departmentWithId: Department = {id: '', ...department};
    return this.departmentService.createDepartment(departmentWithId);
  }

  editDepartment(departmentData: any): Observable<Department> {
    return this.departmentService.updateDepartment(departmentData);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getDepartments();
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        this.addDepartment(args.data).subscribe({
          next: () => {
            this.getDepartments();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editDepartment(args.data).subscribe({
          next: () => {
            this.getDepartments();
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
      this.departmentService.deleteDepartment(args.data[0].id).subscribe({
        next: () => {
          this.getDepartments();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }
}
