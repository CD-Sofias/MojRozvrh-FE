import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AccordionAllModule} from "@syncfusion/ej2-angular-navigations";
import {DropDownListAllModule} from "@syncfusion/ej2-angular-dropdowns";
import {DatePickerAllModule} from "@syncfusion/ej2-angular-calendars";
import {DataManager, Query, ReturnOption} from "@syncfusion/ej2-data";
import {Subject} from "../../types/subject";
import {EventSettingsModel} from "@syncfusion/ej2-schedule";
import {
  ScheduleComponent as EJ2ScheduleComponent
} from "@syncfusion/ej2-angular-schedule/src/schedule/schedule.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    AccordionAllModule,
    DropDownListAllModule,
    DatePickerAllModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  @Input() public subjects: Subject[] = [];

  public lessonTypes: string[] = [];

  public eventSettings: EventSettingsModel;

  public selectedDate: Date = new Date();

  @ViewChild('scheduleObj') public scheduleObj!: EJ2ScheduleComponent;


  ngOnInit() {
    this.lessonTypes = [...new Set(this.subjects.map(subject => subject.type))];
  }


  private showSearchEvents(type: string, data?: Record<string, any>): void {

    if (type === 'show') {
      this.scheduleObj.eventSettings.dataSource = new DataManager({json: Array.isArray(data) ? data : [data]});
    } else {
      this.scheduleObj.eventSettings.dataSource = new DataManager({json: []});
    }
    this.scheduleObj.dataBind();
  }


  public globalSearch(args: KeyboardEvent): void {
    const searchString: string = (args.target as HTMLInputElement).value;
    // console.log(this.scheduleData)
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
}
