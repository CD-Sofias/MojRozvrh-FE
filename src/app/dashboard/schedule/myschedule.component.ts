import {
  CellClickEventArgs,
  DragAndDropService,
  EventSettingsModel,
  GroupModel,
  ResizeService,
  ResourcesModel,
  ScheduleComponent,
  TimelineViewsService,
  View
} from '@syncfusion/ej2-angular-schedule';
import {TextBoxComponent,} from '@syncfusion/ej2-angular-inputs';
import {DatePickerComponent,} from '@syncfusion/ej2-angular-calendars';
import {AutoCompleteComponent, DropDownListComponent,} from '@syncfusion/ej2-angular-dropdowns';

import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';

import {extend, isNullOrUndefined} from '@syncfusion/ej2-base';
import {ChangeEventArgs} from '@syncfusion/ej2-calendars';

import {DataManager, Predicate, Query, ReturnOption} from '@syncfusion/ej2-data';
import {roomData} from "../../../data";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-myschedule',
  templateUrl: './myschedule.component.html',
  styleUrl: './myschedule.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, ResizeService, DragAndDropService]

})
export class MyScheduleComponent {
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

  @ViewChild('sample')
  public AutoCompleteObj!: AutoCompleteComponent;


  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public selectedDay!: number[];
  public startHour: string = '07:00';
  public endHour: string = '20:00';

  public selectedDate: Date = new Date();
  public rowAutoHeight = true;
  public currentView: View = 'TimelineDay';


  public errorMessage: string = '';

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('My schedule');
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


  public groups: Record<string, any>[] = [
    {name: 'nAIVs3', quantity: 10, id: 1},
    {name: 'nAIVs2', quantity: 20, id: 2},
  ];


  public subjects: Record<string, any>[] = [
    {name: 'Test', id: 1, color: '#98AFC7'},
    {name: 'Exam', id: 2, color: '#99C68E'},
    {name: 'Lecture', id: 3, color: '#C299D6'},
    {name: 'Practice', id: 4, color: '#3090C7'},
  ];

  getSubjectColor(id: number) {
    const subject = this.subjects.find(subject => subject['id'] === id);
    return subject ? subject['color'] : 'default';
  }
  // @ts-ignore
  public data: Record<string, any>[] = extend([], roomData, null, true) as Record<string, any>


  public eventSettings: EventSettingsModel = {

    dataSource: this.data,
    fields: {
      id: 'id',
      teacherId: {name: 'teacher_id', title: 'Teacher'},
      subject: {name: 'subject_id', title: 'Subject', validation: {required: true}},
      location: {
        name: 'classroom_id', title: 'Classroom', validation: {
          required: true,
          regex: [
            '^[a-zA-Z0-9- ]*$',
            'Special characters are not allowed in this field',
          ],
        },
      },
      subject_type: {name: 'subject_type', title: 'Subject type'},
      startTime: {name: 'StartTime', title: 'From'},
      endTime: {name: 'EndTime', title: 'To'},
      isAllDay: {name: 'is_all_day'}
    },
  };

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

  public getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s['id'] === subjectId);
    return subject ? subject['name'] : 'Unknown Subject';
  }


  public globalSearch(args: KeyboardEvent): void {
    const searchString: string = (args.target as HTMLInputElement).value;
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
