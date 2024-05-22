import {
  ActionEventArgs,
  CellClickEventArgs,
  DragAndDropService,
  EventSettingsModel as OriginalEventSettingsModel,
  PopupOpenEventArgs,
  ResizeService,
  ScheduleComponent as EJ2ScheduleComponent,
  TimelineViewsService,
  View
} from '@syncfusion/ej2-angular-schedule';
import {TextBoxComponent,} from '@syncfusion/ej2-angular-inputs';
import {DatePickerComponent,} from '@syncfusion/ej2-angular-calendars';
import {AutoCompleteComponent, DropDownListComponent, FilteringEventArgs,} from '@syncfusion/ej2-angular-dropdowns';
import {AfterViewInit, Component, ElementRef, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {EmitType, extend, isNullOrUndefined} from '@syncfusion/ej2-base';
import {ChangeEventArgs} from '@syncfusion/ej2-calendars';
import {Query} from '@syncfusion/ej2-data';
import {Title} from "@angular/platform-browser";
import {FieldOptionsModel} from "@syncfusion/ej2-schedule";
import {SubjectService} from "../../services/subject.service";
import {TeacherService} from "../../services/teacher.service";
import {ClassroomService} from "../../services/classroom.service";
import {GroupService} from "../../services/group.service";
import {ScheduleCellService} from "../../services/schedule-cell.service";
import {ScheduleCell, ScheduleCellCreate} from "../../types/scheduleCell";
import {UserService} from "../../services/user.service";
import {Subject} from "../../types/subject";
import {Teacher} from "../../types/teacher";
import {Group} from "../../types/group";
import {Classroom} from "../../types/classroom";
import {ScheduleService} from "../../services/schedule.service";
import {CreateScheduleModalComponent} from "../create-schedule-modal/create-schedule-modal.component";
import {Observable} from "rxjs";
import {Schedule} from "../../types/schedule";
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import {ButtonComponent} from "@syncfusion/ej2-angular-buttons";
import {AnimationSettingsModel} from "@syncfusion/ej2-splitbuttons";
import {ToastComponent} from "@syncfusion/ej2-angular-notifications";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

interface MyEventFields {
  myNewField?: string;
  teacherId?: FieldOptionsModel;
  group?: FieldOptionsModel;
  subject_type?: FieldOptionsModel;
}

interface EventSettingsModel extends OriginalEventSettingsModel {
  fields?: MyEventFields & OriginalEventSettingsModel['fields'];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, ResizeService, DragAndDropService]

})


export class ScheduleComponent implements OnInit, AfterViewInit {
  loading = true;
  initialized = false;

  constructor(private titleService: Title,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private groupService: GroupService,
              private scheduleCellService: ScheduleCellService,
              private userService: UserService,
              private scheduleService: ScheduleService,
              private router: Router
  ) {



  }






  public dialogObj: DialogComponent;

  public scheduleData: ScheduleCell[];

  userRole: string;


  @ViewChild(CreateScheduleModalComponent)
  public createScheduleModalComponent: CreateScheduleModalComponent;

  @ViewChild('sample')
  public AutoCompleteObj: AutoCompleteComponent;


  public data: Record<string, any>[];

  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  groups: Group[] = [];
  classrooms: Classroom[] = [];
  public fields: Object = {value: 'id', text: 'name'};

  public onChange(args: ScheduleCell): void {
    let valueEle: HTMLInputElement = document.getElementsByClassName('e-input')[0] as HTMLInputElement;
    if (this.AutoCompleteObj.value === "null" || this.AutoCompleteObj.value === null || this.AutoCompleteObj.value === "") {
      valueEle.value = '';
    }
  }

  userID: string;
  public subjectDataSource: Object[];
  public subjectFields: Object = {value: 'Id', text: 'Name'};
  public teacherDataSource: Object[];
  public teacherFields: Object = {value: 'Id', text: 'Name'};
  public classroomDataSource: Object[];
  public classroomFields: Object = {value: 'Id', text: 'Name'};
  public groupDataSource: Object[];
  public groupFields: Object = {value: 'Id', text: 'Name'};


  @ViewChild('scheduleObj') public scheduleObj!: EJ2ScheduleComponent;

  public targetElement?: HTMLElement;
  // public initilaizeTarget: EmitType<object> = () => {
  //   this.targetElement = this.container.nativeElement.parentElement;
  // }


  ngOnInit() {

    // @ts-ignore

    // this.loading = false;
    // this.initilaizeTarget();

    this.titleService.setTitle('My schedule');
    this.loadGroups();
    this.loadClassrooms();
    this.loadTeachers();
    this.loadSubjects();


    // @ts-ignore
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart) {
    //     this.loading = true;
    //   } else if (event instanceof NavigationEnd) {
    //     this.loading = false;
    //   }
    // });


    this.userService.getUsersInfo().subscribe(user => {
      this.userID = user.id;
      this.userRole = user.role;
      this.mySchedules = this.scheduleService.getSchedulesByUserId(this.userID);
    });

    if (this.scheduleData) {
      this.data = this.scheduleData.map(scheduleCell => {
        return {
          id: scheduleCell.id,
          teacher_id: scheduleCell.teacher.id,
          subject_id: scheduleCell.subject.id,
          group_id: scheduleCell.group.id,
          classroom_id: scheduleCell.classroom.id,
          subject_type: scheduleCell.subject.type,
          StartTime: scheduleCell.startTime,
          EndTime: scheduleCell.endTime,
        };
      })
    }


    this.eventSettings = {
      dataSource: extend([], this.data, null, true) as Record<string, any>[],
      fields: {
        id: 'id',
        teacherId: {
          name: 'teacher_id', title: 'Teacher',
          validation: {
            required: true,
          },
        },
        subject: {
          name: 'subject_id',
          title: 'Subject',
          validation: {
            required: true,
          },
        },
        group: {
          name: 'group_id',
          title: 'Group',
          validation: {
            required: true,
          },
        },
        location: {
          name: 'classroom_id', title: 'Classroom', validation: {
            required: true,
            regex: [
              '^[a-zA-Z0-9- ]*$',
              'Special characters are not allowed in this field',
            ],
          },
        },
        subject_type: {
          name: 'subject_type', title: 'Subject type', validation: {
            required: true,
          },
        },
        startTime: {
          name: 'StartTime', title: 'From', validation: {
            required: true,
          },
        },
        endTime: {
          name: 'EndTime', title: 'To', validation: {
            required: true,
          },
        },
        isAllDay: {name: 'is_all_day'}
      },
    };
    // console.log(this.data);
    // console.log(this.eventSettings)
    // window.onload = () => {
    //   this.loading = false;
    // };
    this.loading = false
    this.dialogObj.hide();
  }
  ngAfterViewChecked() {
    this.loading = false;
  }
  ngAfterViewInit() {
    this.initialized = true;

  }




  ngOnChanges(changes: SimpleChanges) {
    if (changes.scheduleData) {
      this.data = this.scheduleData.map(scheduleCell => {
        return {
          id: scheduleCell.id,
          teacher_id: scheduleCell.teacher.id,
          subject_id: scheduleCell.subject.id,
          group_id: scheduleCell.group.id,
          classroom_id: scheduleCell.classroom.id,
          subject_type: scheduleCell.subject.type,
          StartTime: scheduleCell.startTime,
          EndTime: scheduleCell.endTime,
        };
      })
    }
  }


  getData(data: ScheduleCell[]): void {

    this.scheduleData = data;
    this.eventSettings = {
      ...this.eventSettings,
      dataSource: data.map(scheduleCell => {
        return {
          id: scheduleCell.id,
          teacher_id: scheduleCell.teacher.id,
          subject_id: scheduleCell.subject.id,
          group_id: scheduleCell.group.id,
          classroom_id: scheduleCell.classroom.id,
          subject_type: scheduleCell.subject.type,
          StartTime: scheduleCell.startTime,
          EndTime: scheduleCell.endTime,
          RecurrenceRule: 'FREQ=WEEKLY'
        };
      })
    };
  }


  loadGroups(): void {

    this.groupService.getAllGroups().subscribe(groups => {
      this.groups = groups;
      this.groupDataSource = groups.map(group => {
        return {Id: group.id, Name: group.name};
      })
    });

  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.lessonTypes = [...new Set(subjects.map(subject => subject.type))]
      this.subjectDataSource = subjects.map(subject => {
        return {Id: subject.id, Name: subject.name};
      })
    });
  }

  loadClassrooms(): void {
    this.classroomService.getAllClassrooms().subscribe(classrooms => {
      this.classrooms = classrooms;
      this.classroomDataSource = classrooms.map(classroom => {
        return {Id: classroom.id, Name: classroom.code};
      })
    });
  }


  loadTeachers(): void {

    this.teacherService.getAllTeachers().subscribe(teachers => {
      this.teachers = teachers;
      this.teacherDataSource = teachers.map(teacher => {
        return {Id: teacher.id, Name: teacher.name};
      })
    });

  }


  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.data, query);
  }

  onFilteringClassrooms(e: FilteringEventArgs, dataSource: string[]) {
    let query = new Query();
    query = (e.text !== '') ? query.where('code', 'contains', e.text, true) : query;
    e.updateData(dataSource, query);
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'RecurrenceAlert') {
      args.cancel = true;
    }
  }

  public value: string = '';

  public eventSettings: EventSettingsModel;
  @ViewChild('eventTypeObj')
  public eventTypeObj?: DropDownListComponent;
  @ViewChild('titleObj')
  public titleObj?: TextBoxComponent;
  @ViewChild('notesObj')
  public notesObj?: TextBoxComponent;


  @ViewChild('eventTypeSearch') eventTypeSearchObj: any | undefined;
  @ViewChild('subject_id') subjectObj: any | undefined;
  @ViewChild('classroom_id_search_content') locationObj: ElementRef | undefined;
  @ViewChild('startTime_search_content') startTimeObj: DatePickerComponent | undefined;
  @ViewChild('endTime_search_content') endTimeObj: DatePickerComponent | undefined;

  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public selectedDay!: number[];
  public startHour: string = '05:00';
  public endHour: string = '20:00';

  public selectedDate: Date = new Date();
  public rowAutoHeight = true;
  public currentView: View = 'Week';


  public errorMessage: string = '';

  public startDateParser(data: string): Date {
    if (isNullOrUndefined(this.startDate!) && !isNullOrUndefined(data)) {
      return new Date(data);
    } else {
      if (!isNullOrUndefined(this.startDate!)) {
        return new Date(this.startDate!);
      }
    }
    return new Date();
  }


  public endDateParser(data: string): Date {
    if (isNullOrUndefined(this.endDate!) && !isNullOrUndefined(data)) {
      return new Date(data);
    } else {
      if (!isNullOrUndefined(this.endDate!)) {

        return new Date(this.endDate!);
      }
    }
    return new Date();
  }

  public onDateChange(args: ChangeEventArgs): void {
    if (!isNullOrUndefined(args.event!)) {
      if (args.element.id === "StartTime") {
        this.startDate = args.value;
      } else if (args.element.id === "EndTime") {
        this.endDate = args.value;
      }
    }
  }


  getSubjectColor(id: string) {
    const subject = this.subjects.find(subject => subject.id === id);
    return subject ? subject['color'] : 'default';
  }


  public lessonTypes: string[];

  getSubjectTypeById(id: string): string {
    const type = this.lessonTypes.find(type => type === id);
    return type ? type : id;
  }


  getGroupById(id: string): string {
    const group = this.groups.find(group => group.id === id);
    return group ? group.name : id;
  }


  getSubjectNameById(id: string): string {
    const subject = this.subjects.find(subject => subject.id === id);
    return subject ? subject.name : id;
  }


  getTeacherNameById(id: string): string {
    const teacher = this.teachers.find(teacher => teacher.id === id)
    return teacher ? teacher.name : id;
  }

  getTeacherSurnameById(id: string): string {
    const teacher = this.teachers.find(teacher => teacher.id === id)
    return teacher ? teacher.surname : id;
  }

  getClassroomNameById(id: string): string {
    const classroom = this.classrooms.find(classroom => classroom.id === id)
    return classroom ? classroom.code : id;
  }


  public showWeekend: boolean = false;

  public toasts: { [key: string]: Object }[] = [
    {
      title: 'Success!',
      content: 'Data has been saved successfully.',
      cssClass: 'e-toast-success',
      icon: 'e-success toast-icons'
    },
    {
      title: 'Error!',
      content: 'Failed to save data.',
      cssClass: 'e-toast-danger',
      icon: 'e-error toast-icons'
    },
    // ... остальные объекты toast
  ];

  @ViewChild('toasttype')
  protected toastObj: ToastComponent;


  public onActionBegin(args: ActionEventArgs): void {

    // console.log(args)
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      const data: Record<string, any> = args.data instanceof Array ? args.data[0] : args.data;

      console.log(data)

      if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date)) {
        console.log('Slot is not available')
        args.cancel = true;
      }

      console.log(data, 'data')
      let scheduleCell: ScheduleCellCreate = {
        groupId: data.group_id,
        subjectId: data.subject_id,
        teacherId: data.teacher_id,
        classroomId: data.classroom_id,
        startTime: data.StartTime,
        endTime: data.EndTime,
        scheduleId: data.id
      };

      console.log(args.requestType)

      this.scheduleCellService.createScheduleCell(scheduleCell).subscribe({
        next: () => {
          console.log('Schedule cell created');
        },
        error: (error) => {
          console.error('Error creating schedule cell', error);
          args.cancel = true;
        }
      });
    }
    if (args.requestType === 'eventRemove') {
      args.cancel = true;
      this.deleteScheduleCell(args.data[0].id);
    }
  }

  public getHeaderStyles(data: { [key: string]: Object }): Object {

    if (data['elementType'] === 'cell') {
      return {'align-items': 'center', 'color': '#919191'};
    } else {
      return {'background': '#F5F5F5', color: '#919191'};
    }
  }

  @ViewChild('template')
  public Dialog: DialogComponent;

  @ViewChild('ButtonInstance')
  public dlgbtn: ButtonComponent;

  @ViewChild('sendButton')
  public sendButton: ElementRef;

  @ViewChild('inVal')
  public inVal: ElementRef;

  @ViewChild('dialogText')
  public dialogText: ElementRef;

  public showCloseIcon: Boolean = true;
  public height: string = '200px';
  public target = '.control-section';
  public animationSettings: AnimationSettingsModel = {effect: 'None'};
  public width = '435px';
  public isModal: Boolean = true;
  public visible: Boolean = false;

  public dialogClose = (): void => {
    this.dlgbtn.element.style.display = '';

  }

  // public dialogOpen = (): void => {
  //   // this.dlgbtn.element.style.display = 'none';
  // }


  protected addToMySchedule() {
    this.Dialog.show();
    // this.Dialog.element.style.top = '40%';
    this.Dialog.element.style.maxHeight = '100%';
  }


  public header: string = 'Save to your schedule';
  mySchedules: Observable<Schedule[]>;

  saveToSchedule(scheduleId: string, cellData: any): void {
    this.scheduleService.addScheduleCell(scheduleId, cellData).subscribe({
      next: () => {
        this.toastObj.show(this.toasts[0]); // Показать тост об успешном сохранении
        console.log('Cell saved to schedule');

      },
      error: (error) => {
        this.toastObj.show(this.toasts[1]); // Показать тост об ошибке сохранения
        console.error('Error saving cell to schedule', error);
      }
    });
  }

  public isCellSelected: boolean = false;


  handleButtonClick(event: Event): void {
    const scheduleId = (event.target as Element).getAttribute('data-schedule-id');
    const cellData = this.selectedScheduleCell;
    console.log(scheduleId, cellData)
    if ((event.target as Element).classList.contains('dlgbtn')) {
      const scheduleId = (event.target as Element).getAttribute('data-schedule-id');
      const cellData = this.selectedScheduleCell; // Замените на реальные данные ячейки, которую вы хотите сохранить
      this.saveToSchedule(scheduleId, cellData);
    }
  }

  public selectedScheduleCell: string = '';

  onCellClick(args: CellClickEventArgs): void {
    const data = args as any;
    this.selectedScheduleCell = data.id;
  }

  public onOpenDialog = (event: any): void => {
    this.Dialog.show();
  };

  public onOverlayClick: EmitType<object> = () => {
    this.Dialog.hide();
  }

  selectedScheduleId: string;

  promptOkAction(id: string): void {
    this.selectedScheduleId = id;
    console.log(1);
    let value: string = this.selectedScheduleId;
    if (!value) {
      console.error("No schedule selected");
    }
  }

  deleteScheduleCell(id: string): void {
    this.scheduleCellService.deleteScheduleCell(id).subscribe({
      next: () => {
        console.log('Schedule cell deleted');
        this.scheduleObj.closeQuickInfoPopup();
        this.updateData();
      },
      error: (error) => {
        console.error('Error deleting schedule cell', error);
      }
    })
  }

  updateData(): void {

    this.userService.getUsersInfo().subscribe(user => {
      this.userID = user.id;
      this.mySchedules = this.scheduleService.getSchedulesByUserId(this.userID);
    });

    if (this.scheduleData) {
      this.data = this.scheduleData.map(scheduleCell => {
        return {
          id: scheduleCell.id,
          teacher_id: scheduleCell.teacher.id,
          subject_id: scheduleCell.subject.id,
          group_id: scheduleCell.group.id,
          classroom_id: scheduleCell.classroom.id,
          subject_type: scheduleCell.subject.type,
          StartTime: scheduleCell.startTime,
          EndTime: scheduleCell.endTime,
        };
      })
    }

    this.eventSettings = {
      dataSource: extend([], this.data, null, true) as Record<string, any>[],
      fields: this.eventSettings.fields
    };
  }

}
