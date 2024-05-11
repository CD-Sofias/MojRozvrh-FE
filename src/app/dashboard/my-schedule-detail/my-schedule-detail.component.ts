import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Schedule} from "../../types/schedule";
import {ScheduleService} from "../../services/schedule.service";
import {ActivatedRoute} from "@angular/router";
import {ScheduleCell} from "../../types/scheduleCell";
import {Subject} from "../../types/subject";
import {Teacher} from "../../types/teacher";
import {Group} from "../../types/group";
import {Classroom} from "../../types/classroom";
import {extend, Internationalization} from "@syncfusion/ej2-base";
import {
  ScheduleComponent as EJ2ScheduleComponent
} from "@syncfusion/ej2-angular-schedule/src/schedule/schedule.component";
import {View} from "@syncfusion/ej2-angular-schedule";
import {FieldOptionsModel} from "@syncfusion/ej2-schedule";
import {
  EventSettingsModel as OriginalEventSettingsModel
} from "@syncfusion/ej2-schedule/src/schedule/models/event-settings-model";
import {toUTC} from "../../utils/date-utils";

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
  styleUrl: './my-schedule-detail.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MyScheduleDetailComponent implements OnInit {

  @ViewChild('scheduleObj') public scheduleObj!: EJ2ScheduleComponent;
  schedule: Schedule;
  public intl: Internationalization = new Internationalization();
  public showWeekend: boolean = false;
  public data: Record<string, any>[];
  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  groups: Group[] = [];
  classrooms: Classroom[] = [];
  public eventSettings: EventSettingsModel;
  public startHour: string = '06:00';
  public endHour: string = '20:00';
  public selectedDate: Date = new Date();
  public rowAutoHeight = true;
  public currentView: View = 'Week';
  public lessonTypes: string[];

  constructor(private scheduleService: ScheduleService,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({schedule}) => {
      this.schedule = schedule;
    })
    this.data = this.schedule.scheduleCells.map((cell: ScheduleCell) => {
      return {
        id: cell.id,
        teacher: cell.teacher,
        subject: cell.subject,
        group: cell.group,
        classroom: cell.classroom,
        StartTime: toUTC(new Date(cell.startTime)),
        EndTime: toUTC(new Date(cell.endTime)),
        color: cell.subject.type === 'lecture' ? '#FFA500' : '#008000',
        RecurrenceRule: 'FREQ=WEEKLY',
      }
    })
    if (this.schedule.scheduleCells.length > 0)
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
  }

  public getHeaderDetails(data: { [key: string]: Date }): string {
    return this.intl.formatDate(data.StartTime, {type: 'date', skeleton: 'full'}) + ' (' +
      this.intl.formatDate(data.StartTime, {skeleton: 'hm'}) + ' - ' +
      this.intl.formatDate(data.EndTime, {skeleton: 'hm'}) + ')';
  }

  getSubjectColor(id: string) {
    const subject = this.subjects.find(subject => subject.id === id);
    return subject ? subject['color'] : 'default';
  }


  public getHeaderStyles(data: { [key: string]: Object }): Object {
    if (data['elementType'] === 'cell') {
      return {'align-items': 'center', 'color': '#919191'};
    } else {
      return {'background': '#F5F5F5', color: '#919191'};
    }
  }

  deleteScheduleCell(id: string): void {
    this.scheduleService.deleteScheduleCell(this.schedule.id, id).subscribe({
      next: () => {
        this.data = this.data.filter(item => item.id !== id);
        this.scheduleObj.eventSettings.dataSource = this.data;
        this.scheduleObj.closeQuickInfoPopup();
      },
      error: (error) => {
        console.error('Error deleting schedule cell', error);
      }
    });
  }
}

