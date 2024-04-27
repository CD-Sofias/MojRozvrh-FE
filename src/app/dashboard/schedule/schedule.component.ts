import {
  ActionEventArgs,
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
  Input,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
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
import {DialogUtility} from "@syncfusion/ej2-popups";

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
export class ScheduleComponent implements OnInit {


  constructor(private titleService: Title,
              private renderer: Renderer2,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private groupService: GroupService,
              private scheduleCellService: ScheduleCellService,
              private userService: UserService,
              private scheduleService: ScheduleService
  ) {
  }

  public dialogObj;

  public scheduleData: ScheduleCell[];


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

  ngOnInit() {
    this.titleService.setTitle('My schedule');
    this.loadGroups();
    this.loadClassrooms();
    this.loadTeachers();
    this.loadSubjects();

    this.userService.getUsersInfo().subscribe(user => {
      this.userID = user.id;
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
    console.log(this.data);
    console.log(this.eventSettings)



  }

  ngOnChanges(changes: SimpleChanges){
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
        };
      })
    };
    this.scheduleObj.refresh();
    console.log(this.eventSettings)
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

  public value: string = '';

  public eventSettings: EventSettingsModel;
  @ViewChild('eventTypeObj')
  public eventTypeObj?: DropDownListComponent;
  @ViewChild('titleObj')
  public titleObj?: TextBoxComponent;
  @ViewChild('notesObj')
  public notesObj?: TextBoxComponent;

  @ViewChild('scheduleObj') public scheduleObj!: EJ2ScheduleComponent;
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

  getClassroomNameById(id: string): string {
    const classroom = this.classrooms.find(classroom => classroom.id === id)
    return classroom ? classroom.code : id;
  }



  public showWeekend: boolean = false;




  public onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      const data: Record<string, any> = args.data instanceof Array ? args.data[0] : args.data;
      console.log(args)
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

      console.log(scheduleCell)

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
  }


  public getHeaderStyles(data: { [key: string]: Object }): Object {
    if (data['elementType'] === 'cell') {
      return {'align-items': 'center', 'color': '#919191'};
    } else {
      return {'background': '#F5F5F5', color: '#919191'};
    }
  }

  public promptBtnClick = (): void => {
    this.dialogObj = DialogUtility.confirm({
      title: 'Save to your schedule',
      content: 'Select your schedule: <ejs-dropdownlist id="eventTypeSearch" #eventTypeSearchObj [dataSource]="eventTypeData" [fields]="eventTypeFields" [placeholder]="eventTypeWatermark" [index]="0" [change]="onChange($event)" [filtering]="onFiltering" [value]="value" [popupHeight]="popupHeight" [popupWidth]="popupWidth"></ejs-dropdownlist>',
      okButton: { click:this.promptOkAction.bind(this)},
      cancelButton: { click:this.promptCancelAction.bind(this)},
      position: { X: 'center', Y: 'center' },
      closeOnEscape: true
    });
  };

  private promptOkAction(): void {
    let value:string ;
    value = (document.getElementById("inputEle")as any).value;
  }
  private promptCancelAction(): void {
    this.dialogObj.hide();
  }

}
