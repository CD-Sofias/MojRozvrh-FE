import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Schedule} from "../../types/schedule";
import {ScheduleService} from "../../services/schedule.service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ScheduleCell, ScheduleCellCreate} from "../../types/scheduleCell";
import {AutoCompleteComponent, DropDownListComponent, FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {Subject} from "../../types/subject";
import {Teacher} from "../../types/teacher";
import {Group} from "../../types/group";
import {Classroom} from "../../types/classroom";
import {EmitType, extend, Internationalization, isNullOrUndefined} from "@syncfusion/ej2-base";
import {Query} from "@syncfusion/ej2-data";
import {TextBoxComponent} from "@syncfusion/ej2-angular-inputs";
import {
  ScheduleComponent as EJ2ScheduleComponent
} from "@syncfusion/ej2-angular-schedule/src/schedule/schedule.component";
import {DatePickerComponent} from "@syncfusion/ej2-angular-calendars";
import {ActionEventArgs, View} from "@syncfusion/ej2-angular-schedule";
import {ChangeEventArgs} from "@syncfusion/ej2-calendars";
import {Title} from "@angular/platform-browser";
import {SubjectService} from "../../services/subject.service";
import {TeacherService} from "../../services/teacher.service";
import {ClassroomService} from "../../services/classroom.service";
import {GroupService} from "../../services/group.service";
import {ScheduleCellService} from "../../services/schedule-cell.service";
import {UserService} from "../../services/user.service";
import {FieldOptionsModel} from "@syncfusion/ej2-schedule";
import {
  EventSettingsModel as OriginalEventSettingsModel
} from "@syncfusion/ej2-schedule/src/schedule/models/event-settings-model";
import {ej} from "@syncfusion/ej2-schedule/dist/global";
import schedule = ej.schedule;

interface MyEventFields {
  myNewField?: string;
  teacher?: FieldOptionsModel;
  group?: FieldOptionsModel;
  subject?: FieldOptionsModel;
  classroom?: FieldOptionsModel;
}

interface EventSettingsModel extends OriginalEventSettingsModel {
  fields?: MyEventFields & OriginalEventSettingsModel['fields'];
}
@Component({
  selector: 'app-my-schedule-detail',
  templateUrl: './my-schedule-detail.component.html',
  styleUrl: './my-schedule-detail.component.css'
})
export class MyScheduleDetailComponent implements OnInit {

  schedule: Schedule;


  public intl: Internationalization = new Internationalization();
  constructor(private scheduleService: ScheduleService, private route: ActivatedRoute, private titleService: Title,
              private renderer: Renderer2,
              private subjectService: SubjectService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private groupService: GroupService,
              private scheduleCellService: ScheduleCellService,
              private userService: UserService,) {}

  ngOnInit(): void {
    this.route.data.subscribe(({schedule}) => {
      this.schedule = schedule;
    })
    this.loadTeachers();
    this.loadSubjects();
    this.loadClassrooms();
    this.loadGroups();
    this.data = this.schedule.scheduleCells.map((cell: ScheduleCell) => {
      return {
        id: cell.id,
        teacher: cell.teacher,
        subject: cell.subject,
        group: cell.group,
        classroom: cell.classroom,
        StartTime: cell.startTime,
        EndTime: cell.endTime,
        color: cell.subject.type === 'lecture' ? '#FFA500' : '#008000'
      }})
    this.selectedDate = new Date(this.schedule.scheduleCells[0].startTime);
    this.eventSettings = {
      dataSource: extend([], this.data, null, true) as Record<string, any>[],
      fields: {
        id: 'id',
        teacher: {
          name: 'teacher', title: 'Teacher',
        },
        subject: {
          name: 'subject',
          title: 'Subject',
        },
        group: {
          name: 'group',
          title: 'Group',
        },
        location: {
          name: 'classroom', title: 'Classroom',
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
    console.log(this.eventSettings)
  }

  public currentSubjectId: string;
  public currentSubjectName: string;

  public currentClassroomId: string;
  public currentClassroomNumber: number;

  public showWeekend: boolean = false;

  public selectedSubject: String;
  public selectedClassroom: String;

  @Input() selectedGroupScheduleCells: ScheduleCell[];
  @Input() selectedGroup: String;


  @ViewChild('sample')
  public AutoCompleteObj: AutoCompleteComponent;


  public data: Record<string, any>[];


  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  groups: Group[] = [];
  classrooms: Classroom[] = [];
  public fields: Object = {value: 'id', text: 'name'};
  public ClassroomFields: Object = {value: 'id', text: 'code'};

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
  public getHeaderDetails(data: { [key: string]: Date }): string {
    return this.intl.formatDate(data.StartTime, { type: 'date', skeleton: 'full' }) + ' (' +
      this.intl.formatDate(data.StartTime, { skeleton: 'hm' }) + ' - ' +
      this.intl.formatDate(data.EndTime, { skeleton: 'hm' }) + ')';
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
    console.log(id)
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


  onSubjectSelected(event: any): boolean {
    console.log(event)
    let selectElement = document.getElementById('my-select-subject').getElementsByClassName('e-ddl-hidden')[0];
    if (selectElement) {
      this.renderer.addClass(selectElement, 'e-subject');
      this.renderer.addClass(selectElement, 'e-field');
      this.renderer.addClass(selectElement, 'e-input');
    }
    this.selectedSubject = event;

    if (event && event.itemData) {
      let selectedSubject = this.subjects.find(subject => subject.id === event.itemData.id);
      if (!selectedSubject) {
        this.currentSubjectId = null;
        this.currentSubjectName = null;
        let index = this.data.findIndex(item => item.subject_id === event.itemData.id);
        if (index !== -1) {
          this.data[index].subject_id = '';
        }
        console.error('Выбранное значение не найдено в списке subjects');
        return false;
      } else {
        this.currentSubjectId = selectedSubject.id;
        this.currentSubjectName = selectedSubject.name;

        let dataIndex = this.data.findIndex(item => item.subject_id === event.itemData.id);
        if (dataIndex !== -1) {
          this.data[dataIndex].subject_id = this.currentSubjectId;
        }

        return true;
      }
    }
    return false;
  }


  onClassroomSelected(event: any): boolean {
    let selectElement = document.getElementById('my-select-classroom').getElementsByClassName('e-ddl-hidden')[0];
    if (selectElement) {
      this.renderer.addClass(selectElement, 'e-subject');
      this.renderer.addClass(selectElement, 'e-field');
      this.renderer.addClass(selectElement, 'e-input');
    }
    this.selectedClassroom = event;

    if (event && event.itemData) {
      let selectedClassroom = this.classrooms.find(classroom => classroom.id === event.itemData.id);
      if (!selectedClassroom) {
        this.currentClassroomId = null;
        this.currentClassroomNumber = null;
        let index = this.data.findIndex(item => item.classroom_id === event.itemData.id);
        if (index !== -1) {
          this.data[index].classroom_id = '';
        }
        console.error('Выбранное значение не найдено в списке classrooms');
        return false;
      } else {
        this.currentClassroomId = selectedClassroom.id;
        this.currentClassroomNumber = selectedClassroom.number;
        return true;
      }
    }
    return false;
  }

  currentGroupId: String;
  currentGroupName: String;

  onGroupSelected(event: any): boolean {
    let selectElement = document.getElementById('my-select-group').getElementsByClassName('e-ddl-hidden')[0];
    if (selectElement) {
      this.renderer.addClass(selectElement, 'e-subject');
      this.renderer.addClass(selectElement, 'e-field');
      this.renderer.addClass(selectElement, 'e-input');
    }

    this.selectedGroup = event;
    // console.log(this.data);
    if (event && event.itemData) {
      let selectedGroup = this.groups.find(group => group.id === event.itemData.id);
      if (!selectedGroup) {
        this.currentGroupId = null;
        this.currentGroupName = null;
        let index = this.data.findIndex(item => item.group_id === event.itemData.id);
        if (index !== -1) {
          this.data[index].group_id = '';
        }
        console.error('Выбранное значение не найдено в списке groups');
        return false;
      } else {
        this.currentGroupId = selectedGroup.id;
        this.currentGroupName = selectedGroup.name;
        return true;
      }
    }
    return false;
  }


  selectedTeacher: String;
  currentTeacherId: String;
  currentTeacherName: String;

  onTeacherSelected(event: any): boolean {
    let selectElement = document.getElementById('my-select-teacher').getElementsByClassName('e-ddl-hidden')[0];
    if (selectElement) {
      this.renderer.addClass(selectElement, 'e-subject');
      this.renderer.addClass(selectElement, 'e-field');
      this.renderer.addClass(selectElement, 'e-input');
    }
    this.selectedTeacher = event;

    if (event && event.itemData) {
      let selectedTeacher = this.teachers.find(teacher => teacher.id === event.itemData.id);
      let teacherElement = document.getElementById('my-select-teacher');
      if (!selectedTeacher) {
        this.currentTeacherId = null;
        this.currentTeacherName = null;
        teacherElement.classList.add('e-error');
        let index = this.data.findIndex(item => item.teacher_id === event.itemData.id);
        if (index !== -1) {
          this.data[index].teacher_id = '';
        }
        console.error('Выбранное значение не найдено в списке teachers');
        return false;
      } else {
        this.currentTeacherId = selectedTeacher.id;
        this.currentTeacherName = selectedTeacher.name;
        teacherElement.classList.remove('e-error');
        return true;
      }
    }
    return false;
  }


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

  dataBind() {
    this.scheduleObj.dataBind();
  }

  deleteScheduleCell(id: string): void {
    this.scheduleService.deleteScheduleCell(this.schedule.id, id).subscribe({
      next: () => {
        console.log('Schedule cell deleted');
      },
      error: (error) => {
        console.error('Error deleting schedule cell', error);
      }
    });
  }
}

