import {
  ActionEventArgs, CellClickEventArgs,
  DragAndDropService,
  EventSettingsModel as OriginalEventSettingsModel,
  ResizeService,
  ScheduleComponent as EJ2ScheduleComponent,
  TimelineViewsService,
  View
} from '@syncfusion/ej2-angular-schedule';
import {TextBoxComponent,} from '@syncfusion/ej2-angular-inputs';
import {DatePickerComponent,} from '@syncfusion/ej2-angular-calendars';
import {AutoCompleteComponent, DropDownListComponent, FilteringEventArgs,} from '@syncfusion/ej2-angular-dropdowns';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {EmitType, extend, isNullOrUndefined} from '@syncfusion/ej2-base';
import {ChangeEventArgs} from '@syncfusion/ej2-calendars';
import {Query} from '@syncfusion/ej2-data';
import {Title} from "@angular/platform-browser";
import {FieldOptionsModel} from "@syncfusion/ej2-schedule";
import {SubjectService} from "../../../../services/subject.service";
import {TeacherService} from "../../../../services/teacher.service";
import {ClassroomService} from "../../../../services/classroom.service";
import {GroupService} from "../../../../services/group.service";
import {ScheduleCellService} from "../../../../services/schedule-cell.service";
import {UserService} from "../../../../services/user.service";
import {ScheduleService} from "../../../../services/schedule.service";
import {ScheduleCell, ScheduleCellCreate} from "../../../../types/scheduleCell";
import {Subject} from "../../../../types/subject";
import {Teacher} from "../../../../types/teacher";
import {Group} from "../../../../types/group";
import {Classroom} from "../../../../types/classroom";
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import {CreateScheduleModalComponent} from "../../../create-schedule-modal/create-schedule-modal.component";
import {ButtonComponent} from "@syncfusion/ej2-angular-buttons";
import {AnimationSettingsModel} from "@syncfusion/ej2-splitbuttons";
import {Observable} from "rxjs";
import {Schedule} from "../../../../types/schedule";
import {ToastComponent} from "@syncfusion/ej2-angular-notifications";
import {toUTC} from "../../../../utils/date-utils";

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
  selector: 'app-schedule-cell',
  templateUrl: './schedule-cell.component.html',
  styleUrl: './schedule-cell.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, ResizeService, DragAndDropService],

})

export class ScheduleCellComponent implements OnInit{
  loading = true;
  initialized = false;
  public dialogObj: DialogComponent;
  public scheduleData: ScheduleCell[];
  userRole: string;
  @ViewChild(CreateScheduleModalComponent) public createScheduleModalComponent: CreateScheduleModalComponent;
  @ViewChild('sample') public AutoCompleteObj: AutoCompleteComponent;
  public data: Record<string, any>[];
  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  groups: Group[] = [];
  classrooms: Classroom[] = [];
  public fields: Object = {value: 'id', text: 'name'};
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
  public value: string = '';
  public eventSettings: EventSettingsModel;
  @ViewChild('eventTypeObj') public eventTypeObj?: DropDownListComponent;
  @ViewChild('titleObj') public titleObj?: TextBoxComponent;
  @ViewChild('notesObj') public notesObj?: TextBoxComponent;
  @ViewChild('eventTypeSearch') eventTypeSearchObj: any | undefined;
  @ViewChild('subject_id') subjectObj: any | undefined;
  @ViewChild('classroom_id_search_content') locationObj: ElementRef | undefined;
  @ViewChild('startTime_search_content') startTimeObj: DatePickerComponent | undefined;
  @ViewChild('endTime_search_content') endTimeObj: DatePickerComponent | undefined;
  public startDate: Date | undefined;
  public endDate: Date | undefined;
  public startHour: string = '05:00';
  public endHour: string = '20:00';
  public selectedDate: Date = new Date();
  public rowAutoHeight = true;
  public currentView: View = 'Week';
  public errorMessage: string = '';
  public lessonTypes: string[];
  public showWeekend: boolean = false;
  public toasts: { [key: string]: Object }[] = [{
    title: 'Success!',
    content: 'Data has been saved successfully.',
    cssClass: 'e-toast-success',
    icon: 'e-success toast-icons'
  }, {
    title: 'Error!', content: 'Failed to save data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons'
  }, {
    title: 'Error!', content: 'Error updating schedule cell', cssClass: 'e-toast-danger', icon: 'e-error toast-icons'
  }, {
    title: 'Error!', content: 'Error creating schedule cell', cssClass: 'e-toast-danger', icon: 'e-error toast-icons'
  },];
  @ViewChild('template') public Dialog: DialogComponent;
  @ViewChild('ButtonInstance') public dlgbtn: ButtonComponent;
  @ViewChild('sendButton') public sendButton: ElementRef;
  @ViewChild('inVal') public inVal: ElementRef;
  @ViewChild('dialogText') public dialogText: ElementRef;
  public showCloseIcon: Boolean = true;
  public height: string = '200px';
  public target = '.control-section';
  public animationSettings: AnimationSettingsModel = {effect: 'None'};
  public width = '435px';
  public isModal: Boolean = true;
  public visible: Boolean = false;
  public header: string = 'Save to your schedule';
  mySchedules: Observable<Schedule[]>;
  public selectedScheduleCell: string = '';
  @ViewChild('toasttype') protected toastObj: ToastComponent;

  constructor(private titleService: Title,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private groupService: GroupService,
              private scheduleCellService: ScheduleCellService,
              private userService: UserService,
              private scheduleService: ScheduleService,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('My schedule');
    this.loadGroups();
    this.loadClassrooms();
    this.loadTeachers();
    this.loadSubjects();

    this.userService.getUsersInfo().subscribe(user => {
      this.userID = user.id;
      this.userRole = user.role;
      this.mySchedules = this.scheduleService.getSchedulesByUserId(this.userID);
    });

    if (this.scheduleData) {
      let currentDate = new Date();
      let untilYear = currentDate.getMonth() === 8 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
      this.data = this.scheduleData.map(scheduleCell => {
        return {
          id: scheduleCell.id,
          teacher_id: scheduleCell.teacher.id,
          subject_id: scheduleCell.subject.id,
          group_id: scheduleCell.group.id,
          classroom_id: scheduleCell.classroom.id,
          subject_type: scheduleCell.subject.type,
          StartTime: new Date(scheduleCell.startTime),
          EndTime: new Date(scheduleCell.endTime),
          RecurrenceRule: `FREQ=WEEKLY;INTERVAL=1;UNTIL=${untilYear}0831T135742Z;`
        };
      });
    }
    this.eventSettings = {
      dataSource: extend([], this.data, null, true) as Record<string, any>[], fields: {
        id: 'id', teacherId: {
          name: 'teacher_id', title: 'Teacher', validation: {
            required: true,
          },
        }, subject: {
          name: 'subject_id', title: 'Subject', validation: {
            required: true,
          },
        }, group: {
          name: 'group_id', title: 'Group', validation: {
            required: true,
          },
        }, location: {
          name: 'classroom_id', title: 'Classroom', validation: {
            required: true, regex: ['^[a-zA-Z0-9- ]*$', 'Special characters are not allowed in this field',],
          },
        }, subject_type: {
          name: 'subject_type', title: 'Subject type',
        }, startTime: {
          name: 'StartTime', title: 'From', validation: {
            required: true,
          },
        }, endTime: {
          name: 'EndTime', title: 'To', validation: {
            required: true,
          },
        }, isAllDay: {name: 'is_all_day'}
      },
    };
    this.loading = false
    this.dialogObj.hide();
  }

  ngAfterViewInit() {
    this.initialized = true;
  }

  getData(data: ScheduleCell[]): void {
    this.scheduleData = data.map(scheduleCell => ({
      ...scheduleCell,
      startTime: this.toLocalTime(new Date(scheduleCell.startTime)),
      endTime: this.toLocalTime(new Date(scheduleCell.endTime))
    }));
    this.updateEventSettings();
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
    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
    e.updateData(this.data, query);
  }

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

  public onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventCreate') {
      const data: Record<string, any> = args.data instanceof Array ? args.data[0] : args.data;

      if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date)) {
        args.cancel = true;
      } else {
        let scheduleCell: ScheduleCellCreate = {
          groupId: data.group_id,
          subjectId: data.subject_id,
          teacherId: data.teacher_id,
          classroomId: data.classroom_id,
          startTime: this.toUTC(new Date(data.StartTime)),
          endTime: this.toUTC(new Date(data.EndTime)),
          scheduleId: data.id
        };

        this.scheduleCellService.createScheduleCell(scheduleCell).subscribe({
          next: (response) => {
            this.scheduleData.push({
              id: response.id,
              group: response.group,
              subject: response.subject,
              teacher: response.teacher,
              classroom: response.classroom,
              startTime: toUTC(new Date(response.startTime)),
              endTime: toUTC(new Date(response.endTime))
            } as ScheduleCell);
            this.updateEventSettings();
            this.scheduleObj.refreshEvents();
          }, error: (error) => {
            this.toastObj.show(this.toasts[3]);
            console.error('Error creating schedule cell', error);
            args.cancel = true;
          }
        });
      }
    }
    if (args.requestType === 'eventChange') {
      args.cancel = true;
      console.log(args)
      const eventData = args.data instanceof Array ? args.data[0] : args.data;
      console.log(eventData);
      const parent = eventData.parent ? eventData.parent : eventData;
      const occurrence = args.changedRecords[0];
      this.scheduleCellService.updateScheduleCell(parent.id, {
        groupId: occurrence.group_id,
        subjectId: occurrence.subject_id,
        teacherId: occurrence.teacher_id,
        classroomId: occurrence.classroom_id,
        startTime: this.toUTC(new Date(occurrence.StartTime)),
        endTime: this.toUTC(new Date(occurrence.EndTime))
      }).subscribe({
        next: () => {
          this.scheduleData = this.scheduleData.map(cell => {
            if (cell.id === parent.id) {
              return {
                ...cell,
                group: this.groups.find(group => group.id === occurrence.group_id),
                subject: this.subjects.find(subject => subject.id === occurrence.subject_id),
                teacher: this.teachers.find(teacher => teacher.id === occurrence.teacher_id),
                classroom: this.classrooms.find(classroom => classroom.id === occurrence.classroom_id),
                startTime: this.toLocalTime(new Date(occurrence.StartTime)),
                endTime: this.toLocalTime(new Date(occurrence.EndTime))
              };
            }
            return cell;
          });
          this.updateEventSettings();
          this.scheduleObj.refreshEvents();
        }, error: (error) => {
          this.toastObj.show(this.toasts[2]);
          console.error('Error updating schedule cell', error);
        }
      });

    }

    if (args.requestType === 'eventRemove') {
      args.cancel = true;
      const eventData = args.data instanceof Array ? args.data[0] : args.data;
      this.scheduleCellService.deleteScheduleCell(eventData.id).subscribe({
        next: () => {
          this.scheduleData = this.scheduleData.filter(cell => cell.id !== eventData.id);
          this.updateEventSettings();
          this.scheduleObj.refreshEvents();
        }, error: (error) => {
          console.error('Error deleting schedule cell', error);
        }
      });
    }
  }

  public getHeaderStyles(data: { [key: string]: Object }): Object {
    if (data['elementType'] === 'cell') {
      return {'align-items': 'center', 'color': '#919191'};
    } else {
      return {'background': '#F5F5F5', color: '#919191'};
    }
  }

  public dialogClose = (): void => {
    this.dlgbtn.element.style.display = '';

  }

  saveToSchedule(scheduleId: string, cellData: any): void {
    this.scheduleService.addScheduleCell(scheduleId, cellData).subscribe({
      next: () => {
        this.toastObj.show(this.toasts[0]);
        console.log('Cell saved to schedule');

      }, error: (error) => {
        this.toastObj.show(this.toasts[1]);
        console.error('Error saving cell to schedule', error);
      }
    });
  }

  handleButtonClick(event: Event): void {
    const scheduleId = (event.target as Element).getAttribute('data-schedule-id');
    const cellData = this.selectedScheduleCell;
    console.log(scheduleId, cellData)
    if ((event.target as Element).classList.contains('dlgbtn')) {
      const scheduleId = (event.target as Element).getAttribute('data-schedule-id');
      const cellData = this.selectedScheduleCell;
      this.saveToSchedule(scheduleId, cellData);
    }
  }

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

  protected addToMySchedule() {
    this.Dialog.show();
    this.Dialog.element.style.maxHeight = '100%';
  }

  private toUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  private toLocalTime(date: Date): Date {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset * 60000));
  }

  private updateEventSettings(): void {
    let currentDate = new Date();
    let untilYear = currentDate.getMonth() === 8 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
    this.eventSettings = {
      ...this.eventSettings, dataSource: this.scheduleData.map(scheduleCell => ({
        id: scheduleCell.id,
        teacher_id: scheduleCell.teacher.id,
        subject_id: scheduleCell.subject.id,
        group_id: scheduleCell.group.id,
        classroom_id: scheduleCell.classroom.id,
        subject_type: scheduleCell.subject.type,
        StartTime: new Date(scheduleCell.startTime),
        EndTime: new Date(scheduleCell.endTime),
        RecurrenceRule: `FREQ=WEEKLY;INTERVAL=1;UNTIL=${untilYear}0831T135742Z;`
      }))
    };
  }
}
