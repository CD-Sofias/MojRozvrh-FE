import {
  CellClickEventArgs,
  DragAndDropService,
  GroupModel,
  ResizeService,
  ResourcesModel,
  ScheduleComponent,
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
import {extend, isNullOrUndefined} from '@syncfusion/ej2-base';
import {ChangeEventArgs} from '@syncfusion/ej2-calendars';
import {DataManager, Predicate, Query, ReturnOption} from '@syncfusion/ej2-data';
import {Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {FieldSettingsModel} from "@syncfusion/ej2-navigations";
import {FieldOptionsModel} from "@syncfusion/ej2-schedule";
import { EventSettingsModel as OriginalEventSettingsModel } from '@syncfusion/ej2-angular-schedule';
interface ScheduleCell {
  groupId: string;
  subjectId: string;
  teacherId: string;
  classroomId: string;
  startTime: string;
  endTime: string;
  scheduleId: string;
}
interface MyEventFields {
  myNewField?: string;
  teacherId?: FieldOptionsModel;
  subject_type?: FieldOptionsModel;
}
interface EventSettingsModel extends OriginalEventSettingsModel {
  fields?: MyEventFields & OriginalEventSettingsModel['fields'];
}
@Component({
  selector: 'app-myschedule',
  templateUrl: './myschedule.component.html',
  styleUrl: './myschedule.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, ResizeService, DragAndDropService]

})
export class MyScheduleComponent implements OnInit {

  public currentSubjectId: string;
  public currentSubjectName: string;

  public currentClassroomId: string;
  public currentClassroomNumber: string;


  addClasses() {
    let selectElement = document.getElementsByClassName('e-ddl-hidden')[0];
    if (selectElement) {
      this.renderer.addClass(selectElement, 'e-subject');
      this.renderer.addClass(selectElement, 'e-field');
      this.renderer.addClass(selectElement, 'e-input');
    }
  }

  public selectedSubject: String;
  public selectedClassroom: String;


  @Input() selectedGroupScheduleCells: ScheduleCell;
  @Input() selectedGroup: String;
  @Input() scheduleData: ScheduleCell;

  @ViewChild('sample')
  public AutoCompleteObj: AutoCompleteComponent;


  public data: Record<string, any>[];

  subjects: any[] = [];

  public fields: FieldSettingsModel = {value: 'id', text: 'name'};

  public onChange(args: ScheduleCell): void {
    let valueEle: HTMLInputElement = document.getElementsByClassName('e-input')[0] as HTMLInputElement;
    if (this.AutoCompleteObj.value === "null" || this.AutoCompleteObj.value === null || this.AutoCompleteObj.value === "") {
      valueEle.value = '';
    }
  }


  ngOnInit() {
    this.titleService.setTitle('My schedule');

    this.getSubjects();
    this.getGroups();
    this.getClassrooms();
    this.getTeachers();
  }

  onFiltering(e: FilteringEventArgs, dataSource: string[]) {
    let query = new Query();
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(dataSource, query);
  }

  public value: string = '';


  @ViewChild('eventTypeObj')
  public eventTypeObj?: DropDownListComponent;
  @ViewChild('titleObj')
  public titleObj?: TextBoxComponent;
  @ViewChild('notesObj')
  public notesObj?: TextBoxComponent;
  @ViewChild('scheduleObj') public scheduleObj!: ScheduleComponent;

  @ViewChild('eventTypeSearch') eventTypeSearchObj: any | undefined;
  @ViewChild('subject_id') subjectObj: any | undefined;
  @ViewChild('classroom_id_search_content') locationObj: ElementRef | undefined;
  @ViewChild('startTime_search_content') startTimeObj: DatePickerComponent | undefined;
  @ViewChild('endTime_search_content') endTimeObj: DatePickerComponent | undefined;

  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public selectedDay!: number[];
  public startHour: string = '07:00';
  public endHour: string = '20:00';

  public selectedDate: Date = new Date();
  public rowAutoHeight = true;
  public currentView: View = 'TimelineDay';


  public errorMessage: string = '';

  constructor(private titleService: Title, private http: HttpClient, private renderer: Renderer2) {
  }


  onCellClick(args: CellClickEventArgs) {
    let date = new Date(args.startTime);
    this.selectedDay = [date.getDay()];
    this.errorMessage = '';
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

  public group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };

  public allowMultiple = true;
  public resourceDataSource: Record<string, any>[] = [
    {text: 'Monday', id: 1, color: '#98AFC7'},
    {text: 'Tuesday', id: 2, color: '#99c68e'},
    {text: 'Wednesday', id: 3, color: '#C2B280'},
    {text: 'Thursday', id: 4, color: '#3090C7'},
    {text: 'Friday', id: 5, color: '#95b9'},
  ];


  getSubjectColor(id: number) {
    const subject = this.subjects.find(subject => subject['id'] === id);
    return subject ? subject['color'] : 'default';
  }


  getSubjects(): void {
    this.http.get<String[]>(environment.backendUrl + '/subject').subscribe(subjects => {
      this.subjects = subjects;
    });
  }


  groups: any[];
  teachers: any[];
  classrooms: any[];

  getGroups(): void {
    this.http.get<String[]>(environment.backendUrl + '/groups').subscribe(groups => {
      this.groups = groups;
    });
  }

  getTeachers(): void {
    this.http.get<String[]>(environment.backendUrl + '/teacher').subscribe(teachers => {
      this.teachers = teachers;
    });
  }

  getClassrooms(): void {
    this.http.get<String[]>(environment.backendUrl + '/classroom').subscribe(classrooms => {
      this.classrooms = classrooms;
    });
  }

  getSubjectTypeById(id: string): string {
    let subject = this.subjects.find(subject => subject.id === id);
    return subject ? subject.type : id;
  }


  getGroupById(id: string): string {
    let group = this.groups.find(group => group.id === id);
    return group ? group.name : id;
  }


  lessonTypes: String[] = ['Lekcia', 'Praktika', 'Laboratornaia'];


  getSubjectNameById(id: string): string {
    let subject = this.subjects.find(subject => subject.id === id);
    return subject ? subject.name : id;
  }


  getTeacherNameById(id: string): string {
    let teacher = this.teachers.find(teacher => teacher.id === id);
    return teacher ? teacher.name : id;
  }

  getClassroomNameById(id: string): string {
    let classroom = this.classrooms.find(classroom => classroom.id === id);
    return classroom ? classroom.name : id;
  }


  onSubjectSelected(event: any): boolean {
    let selectElement = document.getElementById('my-select-subject').getElementsByClassName('e-ddl-hidden')[0];
    if (selectElement) {
      this.renderer.addClass(selectElement, 'e-subject');
      this.renderer.addClass(selectElement, 'e-field');
      this.renderer.addClass(selectElement, 'e-input');
    }
    console.log(event);
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

  removeAttributes() {
    let inputElements = document.getElementsByClassName('e-input');
    Array.from(inputElements).forEach((inputElement: any) => {
      this.renderer.removeAttribute(inputElement, 'tabindex');
      this.renderer.removeAttribute(inputElement, 'aria-label');
      this.renderer.removeAttribute(inputElement, 'aria-autocomplete');
      this.renderer.removeAttribute(inputElement, 'aria-expanded');
      this.renderer.removeAttribute(inputElement, 'aria-readonly');
      this.renderer.removeAttribute(inputElement, 'autocomplete');
      this.renderer.removeAttribute(inputElement, 'autocapitalize');
      this.renderer.removeAttribute(inputElement, 'spellcheck');
      this.renderer.removeAttribute(inputElement, 'aria-controls');
      this.renderer.removeAttribute(inputElement, 'aria-describedby');
    });
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
        this.currentClassroomNumber = selectedClassroom.classroomNumber;
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
    console.log(this.data);
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
    console.log(this.data);
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


  public eventSettings: EventSettingsModel;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.scheduleData) {
      this.eventSettings = {
        dataSource: extend([], this.scheduleData, null, true) as Record<string, any>[],
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
    }
  }


  public onActionBegin(args: string[] | any): void {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      let data: Record<string, any>;

      if (args.requestType === 'eventCreate') {
        data = (args.data[0] as Record<string, any>);
      } else if (args.requestType === 'eventChange') {
        data = (args.data as Record<string, any>);
      }

      if (!this.onSubjectSelected({itemData: {id: data.subject_id}})) {
        args.cancel = true;
        return;
      }

      if (!this.onClassroomSelected({itemData: {id: data.classroom_id}})) {
        args.cancel = true;
        return;
      }

      if (!this.onTeacherSelected({itemData: {id: data.teacher_id}})) {
        args.cancel = true;
        return;
      }

      // Проверка доступности слота
      if (!this.scheduleObj.isSlotAvailable(data)) {
        args.cancel = true;
        return;
      }

      let scheduleCell: ScheduleCell = {
        groupId: data.group_id,
        subjectId: data.subject_id,
        teacherId: data.teacher_id,
        classroomId: data.classroom_id,
        startTime: data.StartTime.toISOString(),
        endTime: data.EndTime.toISOString(),
        scheduleId: data.id
      };

      console.log(scheduleCell)

      this.createScheduleCell(scheduleCell);
    }
  }


  createScheduleCell(scheduleCell: ScheduleCell): void {
    this.http.post<ScheduleCell>(environment.backendUrl + '/schedule_cell', scheduleCell).subscribe({
      next: response => {
        console.log('Response from the server:', response);
      },
      error: error => {
        console.error('Error:', error);
      }
    });
  }


  public getResourceData(data: { [key: string]: Object }): { [key: string]: Object } {
    const resources: ResourcesModel = this.scheduleObj!.getResourceCollections()[0];
    return (resources.dataSource as Object[]).filter((resource: Object) =>
      (resource as { [key: string]: Object; })['Id'] === data['RoomId'])[0] as { [key: string]: Object };
  }

  public getHeaderStyles(data: { [key: string]: Object }): Object {
    if (data['elementType'] === 'cell') {
      return {'align-items': 'center', 'color': '#919191'};
    } else {
      const resourceData: { [key: string]: Object } = this.getResourceData(data);
      return {'background': resourceData['Color'], 'color': '#FFFFFF'};
    }
  }

  public getGroupName(id: number): string {
    let group = this.groups.find(group => group['id'] === id);
    return group ? group['name'] : 'Группа не найдена';
  }

  public globalSearch(args: KeyboardEvent): void {
    const searchString: string = (args.target as HTMLInputElement).value;
    console.log(this.scheduleData)
    if (searchString !== '') {
      new DataManager(this.eventSettings.dataSource as Record<string, any>[])
        .executeQuery(
          new Query().search(
            searchString,
            ['subject_id', 'classroom_id', 'teacher_id'],
            null!,
            true,
            true
          )
        )
        .then((e: ReturnOption) => {
          const resultArray = Array.isArray(e.result) ? e.result : [e.result];
          if (resultArray.length > 0) {
            let earliestTime = resultArray[0]['StartTime'];
            resultArray.forEach(event => {
              if (event['StartTime'] < earliestTime) {
                earliestTime = event['StartTime'];
              }
            });

            this.selectedDate = earliestTime;

            this.showSearchEvents('show', resultArray);
          } else {
            this.showSearchEvents('hide');
          }
        });
    } else {
      this.showSearchEvents('show', this.eventSettings.dataSource as Record<string, any>[]);
      this.selectedDate = new Date();
    }
  }

  private showSearchEvents(type: string, data?: Record<string, any>): void {

    if (type === 'show') {
      this.scheduleObj.eventSettings.dataSource = new DataManager({json: Array.isArray(data) ? data : [data]});
    } else {
      this.scheduleObj.eventSettings.dataSource = new DataManager({json: []});
    }
    this.scheduleObj.dataBind();
  }

  public getSubjectId(subjectName: string): number {
    const subject = this.subjects.find(s => s['name'] === subjectName);
    return subject ? subject['id'] : -1;
  }


  public searchOnClick(): void {
    const searchObj: Record<string, any>[] = [];
    let endDate: Date;
    const formElements: string[] = [
      this.subjectObj!.nativeElement.value,
      this.locationObj!.nativeElement.value,
      this.eventTypeSearchObj!.itemData ? this.getSubjectId(this.eventTypeSearchObj!.itemData.name) : ''
    ];
    const fieldNames: string[] = ['subject_id', 'classroom_id', 'subject_type'];
    formElements.forEach((value: string, index: number) => {
      if (value && value !== '') {
        searchObj.push({
          field: fieldNames[index],
          operator: 'contains',
          value: value,
          predicate: 'or',
          matchcase: 'true'
        });
      }
    });
    console.log(searchObj)
    if (this.startTimeObj!.value) {
      searchObj.push({
        field: 'StartTime',
        operator: 'greaterthanorequal',
        value: this.startTimeObj!.value,
        predicate: 'and',
        matchcase: false
      });
    }
    if (this.endTimeObj!.value) {
      const date: Date = new Date(+this.endTimeObj!.value);
      endDate = new Date(date.setDate(date.getDate() + 1));
      searchObj.push({
        field: 'EndTime',
        operator: 'lessthanorequal',
        value: endDate,
        predicate: 'and',
        matchcase: false
      });
    }
    if (searchObj.length > 0) {
      const filter: Record<string, any> = searchObj[0];
      let predicate: Predicate = new Predicate(filter['field'], filter['operator'], filter['value'], filter['matchcase']);
      for (let i = 1; i < searchObj.length; i++) {
        predicate = predicate.and(searchObj[i]['field'], searchObj[i]['operator'], searchObj[i]['value'], searchObj[i]['matchcase']);
      }

      const result: Record<string, any>[] = new DataManager(this.eventSettings.dataSource as Record<string, any>[]).executeLocal(new Query().where(predicate));
      if (result.length > 0) {
        let earliestTime = result[0]['StartTime'];
        result.forEach(event => {
          if (event['StartTime'] < earliestTime) {
            earliestTime = event['StartTime'];
          }
        });

        this.selectedDate = earliestTime;

        this.showSearchEvents('show', result);
      } else {
        this.showSearchEvents('show', []);
      }
    } else {
      this.showSearchEvents('show', this.eventSettings.dataSource as Record<string, any>[]);
      this.selectedDate = new Date();
    }
  }

  public clearOnClick(): void {
    (document.getElementById('form-search') as HTMLFormElement).reset();
    this.showSearchEvents('show', this.eventSettings.dataSource as Record<string, any>[]);
    this.selectedDate = new Date();
  }

}
