import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import {ButtonModel} from "@syncfusion/ej2-angular-buttons";
import {EmitType} from "@syncfusion/ej2-base";
import {ScheduleService} from "../../services/schedule.service";
import {ScheduleCell} from "../../types/scheduleCell";
import {Router} from "@angular/router";
import {ScheduleComponent} from "../schedule/schedule.component";
import {ToastComponent} from "@syncfusion/ej2-angular-notifications";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-schedule-modal',
  templateUrl: './create-schedule-modal.component.html',
  styleUrl: './create-schedule-modal.component.css'
})
export class CreateScheduleModalComponent {

  @ViewChild('scheduleComponent') public scheduleComponent: ScheduleComponent;


  @ViewChild('modalDialog') public modalDialog: DialogComponent;

  @ViewChild('footerTemplate') public footerTemplate: ElementRef;


  public toasts: { [key: string]: Object }[] = [{
    title: 'Success!',
    content: 'Schedule has been saved successfully.',
    cssClass: 'e-toast-success',
    icon: 'e-success toast-icons'
  }, {
    title: 'Error!', content: 'Failed to save schedule.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons'
  },
];
  @ViewChild('toasttype') protected toastObj: ToastComponent;
  public target: string = '#modalTarget';
  public width: string = '335px';
  public header: string = 'Save to your schedule';
  public isModal: Boolean = true;
  public height: string = '200px';
  public proxy: any = this;

  @Input() scheduleData: ScheduleCell[];
  @Input() userID: string;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef | any;
  public targetElement?: HTMLElement;
  public visible: Boolean = false;

  public scheduleForm: FormGroup;

  constructor(private router: Router, private scheduleService: ScheduleService) {
    this.scheduleForm = new FormGroup({
      scheduleName: new FormControl<string>('', [Validators.required, Validators.minLength(3)])
    });
  }

  public onOpenDialog = (event: any): void => {
    this.modalDialog.show();
  };

  public dialogOpen: EmitType<object> = () => {
    this.modalDialog.show();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.modalDialog.hide();
  }

  public dlgButtonClick = (): void => {
    if (this.scheduleForm.valid) {
      this.modalDialog.hide();
      console.log(this.scheduleData);
      if (this.scheduleData) {
        this.scheduleService.createSchedule({
          name: this.scheduleForm.value.scheduleName,
          userId: this.userID,
          scheduleCellIds: this.scheduleData.map(scheduleCell => scheduleCell.id)
        }).subscribe({
          next: response => {
            this.toastObj.show(this.toasts[0]);
            console.log(response);
            this.router.navigate(['/my-schedule', response.id]);
          }, error: error => {
          }
        });
        console.log(this.scheduleData)
      } else {
        this.toastObj.show(this.toasts[1]);
        console.error('scheduleData is undefined');
      }
    }
  }

  public buttons: { [key: string]: ButtonModel }[] = [{
    click: this.dlgButtonClick.bind(this),
    buttonModel: {content: 'Send', isPrimary: true}
  }];

}
