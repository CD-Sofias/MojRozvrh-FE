import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {ScheduleTableCreatorComponent} from "../schedule-table-creator.component";
import {Group} from "../../../../types/group";
import {Department} from "../../../../types/department";
import {GridModule} from "@syncfusion/ej2-angular-grids";
import {ToastModule} from "@syncfusion/ej2-angular-notifications";
import {NumericTextBoxModule, TextBoxModule} from "@syncfusion/ej2-angular-inputs";
import {DropDownListModule, FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
    TextBoxModule
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent extends ScheduleTableCreatorComponent{
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
      this.departments = departments.map(department => ({ id: department.id, name: department.name }));
    });
  }



  getGroups(): void {
    this.groupService.getAllGroups().subscribe(groups => {
      this.groups = groups;
      this.data = this.groups;
    });
  }

  addGroup(group: { name: string, quantity: number, department: Department }): Observable<Group> {
    const groupToSend = {
      name: group.name,
      quantity: group.quantity,
      departmentId: group.department.id
    };
    return this.groupService.createGroup(groupToSend);
  }

  editGroup(groupData: any): Observable<Group> {
    const groupToSend = {
      name: groupData.name,
      quantity: groupData.quantity,
      departmentId: groupData.department.id
    };
    //TODO add id to groupData
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
    console.log(args.requestType);
    if (args.requestType === 'save') {
      console.log(args.action);

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
        // newData.id = args.data.id;
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
