import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {CreateGroup, Group} from "../../../../types/group";
import {GridModule} from "@syncfusion/ej2-angular-grids";
import {ToastModule} from "@syncfusion/ej2-angular-notifications";
import {NumericTextBoxModule, TextBoxModule} from "@syncfusion/ej2-angular-inputs";
import {DropDownListModule, FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Query} from "@syncfusion/ej2-data";
import {GroupService} from "../../../../services/group.service";
import {DepartmentService} from "../../../../services/department.service";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    GridModule,
    ToastModule,
    NumericTextBoxModule,
    DropDownListModule,
    ReactiveFormsModule,
    TextBoxModule,
    FormsModule
  ],
  templateUrl: './groups.component.html',
})
export class GroupsComponent extends ScheduleTableCreatorComponent {
  groups: Group[];

  groupForm: FormGroup;

  departments: any[];
  public filterPlaceholder: string = 'Search';
  public watermark: string = 'Select a department';
  public height: string = '220px';

  constructor(private groupService: GroupService, private departmentService: DepartmentService, private formBuilder: FormBuilder) {
    super();
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      department: ['', Validators.required]
    });
  }


  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments.map(department => ({id: department.id, name: department.name}));
    });
  }


  onDepartmentChange(event: any) {
    this.groupForm.patchValue({
      department: event
    });
  }

  getGroups(): void {
    this.groupService.getAllGroups().subscribe(groups => {
      this.groups = groups;
      this.data = this.groups;
    });
  }

  addGroup(group: { name: string, quantity: number, department: string }): Observable<Group> {
    const groupToSend: CreateGroup = {
      name: group.name,
      quantity: group.quantity,
      departmentId: this.groupForm.get('department').value
    };
    console.log(this.groupForm.get('department'))
    return this.groupService.createGroup(groupToSend);
  }

  editGroup(groupData: any): Observable<Group> {
    const selectedDepartmentId = this.groupForm.get('department').value;
    const selectedDepartment = this.departments.find(department => department.id === selectedDepartmentId);
    console.log(selectedDepartment.id)
    const groupToSend: CreateGroup = {
      name: groupData.name,
      quantity: groupData.quantity,
      departmentId: selectedDepartment.id
    };

    return this.groupService.updateGroup(groupData.id, groupToSend);
  }


  public ngOnInit(): void {
    super.ngOnInit();
    this.getGroups();
    this.getDepartments();
  }

  onFiltering(event: FilteringEventArgs): void {
    let query: Query = new Query();
    query = (event.text !== '') ? query.where('name', 'startswith', event.text, true) : query;
    event.updateData(this.departments, query);
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    super.actionBegin(args);
    if (args.requestType === 'save') {

      if (args.action === 'add') {
        this.addGroup(args.data).subscribe({
          next: () => {
            this.getGroups();
          },
          error: error => {
            console.error(error);
            args.cancel = true;
            this.toastObj.show(this.toasts[1]);
          }
        });
      } else if (args.action === 'edit') {
        this.editGroup(args.data).subscribe({
          next: () => {
            this.getGroups();
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
      this.groupService.deleteGroup(args.data[0].id).subscribe({
        next: () => {
          this.getGroups();
        },
        error: error => {
          console.error(error);
          this.toastObj.show(this.toasts[0]);
        }
      });
    }
  }

}
