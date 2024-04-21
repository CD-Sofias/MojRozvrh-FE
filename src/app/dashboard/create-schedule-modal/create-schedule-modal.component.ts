import {Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import {ButtonComponent, ButtonModel, CheckBoxComponent} from "@syncfusion/ej2-angular-buttons";
import {AnimationSettingsModel} from "@syncfusion/ej2-splitbuttons";
import {detach, EmitType, isNullOrUndefined} from "@syncfusion/ej2-base";
import {ScheduleService} from "../../services/schedule.service";
import {ScheduleCell} from "../../types/scheduleCell";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-schedule-modal',
  templateUrl: './create-schedule-modal.component.html',
  styleUrl: './create-schedule-modal.component.css'
})
export class CreateScheduleModalComponent {
  @ViewChild('sendButton')
  public sendButton: ElementRef;

  @ViewChild('modalDialog')
  public modalDialog: DialogComponent;

  @ViewChild('overlay')
  public overlay: CheckBoxComponent;

  @ViewChild('modalButton')
  public modalButton: ButtonComponent;

  public target: string = '#modalTarget';
  public width: string = '335px';
  public header: string = 'Software Update';
  public content: string = 'Your current software version is up to date.';
  public isModal: Boolean = true;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };

  @Input() selectedGroupScheduleCells: ScheduleCell[];
  @Input() userID: string;

  constructor(private router: Router, private scheduleService: ScheduleService) { }

  ngAfterViewInit(): void {
    this.modalButton.element.focus();
  }

  public visible: Boolean = false;

  public scheduleName: string = '';

  public modalBtnClick = (): void => {
    this.modalDialog.show();
  }
  public modalDlgClose = (): void => {
    this.modalButton.element.style.display = '';
  }

  public modalDlgOpen = (): void => {
    this.modalButton.element.style.display = 'none';
  }
  public onOpenDialog = (event: any): void => {
    // Call the show method to open the Dialog
    this.modalDialog.show();
  };
  public onOverlayClick: EmitType<object> = () => {
    this.modalDialog.hide();
  }
  public dlgButtonClick = (): void => {
    this.modalDialog.hide();
    console.log(this.scheduleName);

    this.scheduleService.createSchedule({
      name: 'MySchedule',
      userId: this.userID,
      scheduleCellIds: this.selectedGroupScheduleCells.map(scheduleCell => scheduleCell.id)
    }).subscribe({
      next: response => {
        console.log(response);
        this.router.navigate(['/myschedule']);
      },
      error: error => {}
    });
    console.log(this.selectedGroupScheduleCells)
  }
  public overlayClick = (): void => {
    if (this.overlay.checked) {
      this.modalDialog.hide();
    }
  }

  public buttons: { [key: string]: ButtonModel }[] = [{ click: this.dlgButtonClick.bind(this), buttonModel: { content: 'Send', isPrimary: true } }];

}
