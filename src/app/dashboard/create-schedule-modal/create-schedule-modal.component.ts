import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import { ButtonModel} from "@syncfusion/ej2-angular-buttons";
import {AnimationSettingsModel} from "@syncfusion/ej2-splitbuttons";
import {EmitType} from "@syncfusion/ej2-base";
import {ScheduleService} from "../../services/schedule.service";
import {ScheduleCell} from "../../types/scheduleCell";
import {Router} from "@angular/router";
import {ScheduleComponent} from "../schedule/schedule.component";

@Component({
  selector: 'app-create-schedule-modal',
  templateUrl: './create-schedule-modal.component.html',
  styleUrl: './create-schedule-modal.component.css'
})
export class CreateScheduleModalComponent implements OnInit {

  @ViewChild('scheduleComponent')
  public scheduleComponent: ScheduleComponent;


  @ViewChild('modalDialog')
  public modalDialog: DialogComponent;

  @ViewChild('footerTemplate')
  public footerTemplate: ElementRef;


  public target: string = '#modalTarget';
  public width: string = '335px';
  public header: string = 'Save to your schedule';
  // public content: string = 'Your current software version is up to date.';
  public isModal: Boolean = true;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public opened: Boolean = false;
  public height: string = '200px';
  public proxy: any = this;

  @Input() scheduleData: ScheduleCell[];
  @Input() userID: string;
  public scheduleName: string = '';
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef | any;
  public targetElement?: HTMLElement;

  constructor(private router: Router, private scheduleService: ScheduleService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.scheduleData && changes.scheduleData.currentValue) {
      console.log('scheduleData is now defined:', this.scheduleData);
    }
  }
  ngOnInit() {
    this.initilaizeTarget();
  }

  public visible: Boolean = false;

  public modalBtnClick = (): void => {
    this.modalDialog.show();
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
  this.modalDialog.hide();
  console.log(this.scheduleName);
  console.log(this.scheduleData);

  if (this.scheduleData) {
    this.scheduleService.createSchedule({
      name: this.scheduleName,
      userId: this.userID,
      scheduleCellIds: this.scheduleData.map(scheduleCell => scheduleCell.id)
    }).subscribe({
      next: response => {
        console.log(response);
        this.router.navigate(['/my-schedule', response.id]);
      },
      error: error => {}
    });
    console.log(this.scheduleData)
  } else {
    console.error('scheduleData is undefined');
  }
}
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  }

  public eventTypeData: { [key: string]: Object }[] = [
    { Id: '1', Name: 'Schedule 1' },
    { Id: '2', Name: 'Schedule 2' },
    // ... другие расписания ...
  ];
  public eventTypeFields: Object = { text: 'Name', value: 'Id' };
  public eventTypeWatermark: string = 'Select your schedule';
  public popupHeight: string = '200px';
  public popupWidth: string = '300px';





  public buttons: { [key: string]: ButtonModel }[] = [{ click: this.dlgButtonClick.bind(this), buttonModel: { content: 'Send', isPrimary: true } }];

  onSaveDialog() {
    this.modalDialog.hide();
  }


  onCloseDialog($event: MouseEvent) {
    this.modalDialog.hide();
  }
}
