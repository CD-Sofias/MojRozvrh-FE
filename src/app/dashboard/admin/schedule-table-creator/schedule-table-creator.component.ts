import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent} from "@syncfusion/ej2-angular-notifications";
import {EditSettingsModel} from "@syncfusion/ej2-angular-grids";
import {Schedule} from "../../../types/schedule";
import {ScheduleCell} from "../../../types/scheduleCell";

@Component({
  selector: 'app-schedule-table-creator',
  templateUrl: './schedule-table-creator.component.html',
  styleUrls: ['./schedule-table-creator.component.css'],
})
export class ScheduleTableCreatorComponent implements OnInit {
  @ViewChild('toasttype')
  protected toastObj: ToastComponent;

  isSmallScreen: boolean;
  public toasts: { [key: string]: Object }[] = [
    {
      title: 'Error!',
      content: 'Entity is still referenced in another entity.',
      cssClass: 'e-toast-danger',
      icon: 'e-error toast-icons'
    },
    {title: 'Error!', content: 'Unknown error', cssClass: 'e-toast-danger', icon: 'e-error toast-icons'}
  ];

  public data: Object[];
  public editSettings: EditSettingsModel;
  public toolbar: string[];
  public orderidrules: Object;
  public customeridrules: Object;
  public freightrules: Object;
  public pageSettings: Object;
  public editparams: Object;
  public scrollSettings: Object;
  public heightTable: string;

  public ngOnInit(): void {
    this.editSettings = {allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog'};
    this.toolbar = ['Add', 'Edit', 'Delete'];
    this.orderidrules = {required: true, number: true};
    this.customeridrules = {required: true};
    this.freightrules = {required: true};
    this.editparams = {params: {popupHeight: '300px'}};
    this.pageSettings = {pageCount: 5};
    this.scrollSettings = { width: 'auto', height: '100%' };
    this.heightTable= '400px';
  }

  actionBegin(args: { requestType: string, action: string, data: any, rowData: any, cancel?: boolean }): void {
    if (args.requestType === 'beginEdit') {
      setTimeout(() => {
        const dialog = document.querySelector('.e-dlg-header-content');
        if (dialog) {
          console.log(dialog);
          dialog.querySelector('.e-dlg-header').textContent = `Details of ${args.rowData.name || args.rowData.code || args.rowData.street}`;
        }
      }, 0);
    }
  }

  public scheduleData: Schedule[] = [];
  public scheduleCells: ScheduleCell[] = [];

  getData(data: ScheduleCell[]): void {
    this.scheduleCells = data;
  }
}
