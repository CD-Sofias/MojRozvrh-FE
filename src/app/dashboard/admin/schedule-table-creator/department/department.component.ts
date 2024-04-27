import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {CreateDepartment, Department} from "../../../../types/department";
import {Observable, tap} from "rxjs";
import {Component} from "@angular/core";
import {DepartmentService} from "../../../../services/department.service";
import {FacultyService} from "../../../../services/faculty.service";
import {FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {Query} from "@syncfusion/ej2-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent extends ScheduleTableCreatorComponent {
  departments: Department[];
  facultyDataSource: any[];

  constructor(private departmentService: DepartmentService, private facultyService: FacultyService, private formBuilder: FormBuilder) {
    super();
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      facultyId: ['', Validators.required]
    });
    this.facultyDataSource = [];
  }

  departmentForm: FormGroup;
  public height: string = '220px';
  public watermark: string = 'Select a faculty';
  public filterPlaceholder: string = 'Search';


  onFiltering(event: FilteringEventArgs): void {
    let query: Query = new Query();
    query = (event.text !== '') ? query.where('name', 'startswith', event.text, true) : query;
    event.updateData(this.facultyDataSource, query);
  }

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
      this.data = this.departments;
    });
  }

  getFaculties(): void {
    this.facultyService.getAllFaculties().subscribe(faculties => {
      this.facultyDataSource = faculties.map(faculty => ({...faculty}));
    });
  }

  getFacultyName(departmentId: string): string {
    const faculty = this.facultyDataSource.find(faculty =>
      faculty.departments.some((department: { id: string; }) => department.id === departmentId)
    );
    return faculty ? faculty.name : 'Unknown';
  }

  getFacultyId(departmentId: string): string {
    const faculty = this.facultyDataSource.find(faculty =>
        Array.isArray(faculty.departments) && faculty.departments.some((department: {
          id: string;
        }) => department.id === departmentId)
    );
    return faculty ? faculty.id : null;
  }

  addDepartment(department: { name: string, facultyId: string }): Observable<Department> {
    const departmentWithId: CreateDepartment = {
      name: department.name,
      facultyId: department.facultyId
    };
    return this.departmentService.createDepartment(departmentWithId).pipe(
      tap(() => {
        this.getFaculties();
      })
    );
  }

  editDepartment(departmentData: any): Observable<Department> {
    if (departmentData) {
      const requestData = {
        ...departmentData,
        name: departmentData.name,
        facultyId: this.departmentForm.get('facultyId').value
      };
      return this.departmentService.updateDepartment(requestData).pipe(
        tap(() => {
          const department = this.departments.find(department => department.id === departmentData.id);
          if (department) {
            department.name = departmentData.name;
            department.facultyId = this.departmentForm.get('facultyId').value;
          }
          this.getFaculties();
        })
      );
    } else {
      console.error('facultyId is not provided in departmentData');
    }
  }

  onFacultyChange(event: any): void {
    const selectedFacultyId = event.itemData.id;
    // console.log(event)
    this.departmentForm.get('facultyId').setValue(selectedFacultyId);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.getDepartments();
    this.getFaculties();
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);

    if (args.requestType === 'save') {
      if (args.action === 'add') {
        const existingDepartment = this.departments.find(dep => dep.name === args.data.name);
        if (existingDepartment) {
          this.toastObj.show({
            title: 'Error',
            content: 'Department with the same name already exists',
            cssClass: 'e-toast-danger'
          });
          args.cancel = true;
          return;
        }

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
