import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AccordionAllModule} from "@syncfusion/ej2-angular-navigations";
import {DropDownListModule, DropDownListComponent, FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {DatePickerAllModule, DatePickerModule} from "@syncfusion/ej2-angular-calendars";
import {DataManager, Query, ReturnOption} from "@syncfusion/ej2-data";
import {Subject} from "../../types/subject";
import {EventSettingsModel} from "@syncfusion/ej2-schedule";
import {
  ScheduleComponent as EJ2ScheduleComponent
} from "@syncfusion/ej2-angular-schedule/src/schedule/schedule.component";
import {EmitType} from "@syncfusion/ej2-base";
import {GroupService} from "../../services/group.service";
import {TeacherService} from "../../services/teacher.service";
import {Group} from "../../types/group";
import {Teacher} from "../../types/teacher";
import {ClassroomService} from "../../services/classroom.service";
import {Classroom} from "../../types/classroom";
import {SubjectService} from "../../services/subject.service";
import {ScheduleCellService} from "../../services/schedule-cell.service";
import {ScheduleCell} from "../../types/scheduleCell";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [
    DropDownListModule,
    AccordionAllModule,
    DatePickerModule
  ],
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private groupService: GroupService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private subjectService: SubjectService,
              private scheduleCellService: ScheduleCellService) {
  }
  public groups: Group[] = [];
  public teachers: Teacher[] = [];
  public classrooms: Classroom[] = [];
  public subjects: Subject[] = [];
  public data: { [key: string]: Object; }[];
  @Output() dataEvent = new EventEmitter<ScheduleCell[]>();
  @ViewChild('typeList')
  public typeObj: DropDownListComponent;

  @ViewChild('searchList')
  public searchObj: DropDownListComponent;

  public searchData: Object[] = [
    { Id: 'Type1', Type: 'Groups' },
    { Id: 'Type2', Type: 'Teachers' },
    { Id: 'Type3', Type: 'Classrooms' },
    { Id: 'Type4', Type: 'Subjects' },
  ];

  public fields: Object = { text: 'Type', value: 'Id' };
  public dataFields: Object = { value: 'Id', text: 'Name' };
  public searchValue: string;
  public typeValue: string = 'Type1';
  public onChange1(args: any): void {
    if (this.typeValue) {
      console.log(this.typeValue)
      this.searchObj.enabled = true;
      if (this.typeObj.text === 'Groups') {
        this.data = this.groups.map(group => {
          return {Id: group.id, Name: group.name};
        })
      }
      if (this.typeObj.text === 'Teachers') {
        this.data = this.teachers.map(teacher => {
          return {Id: teacher.id, Name: teacher.name};
        })
      }
      if (this.typeObj.text === 'Classrooms') {
        this.data = this.classrooms.map(classroom => {
          return {Id: classroom.id, Name: classroom.code};
        })
      }
      if (this.typeObj.text === 'Subjects') {
        this.data = this.subjects.map(subject => {
          return {Id: subject.id, Name: subject.name};
        })
      }
      console.log(this.data)
      this.searchObj.dataSource = this.data;
      this.searchObj.dataBind();
      console.log(this.searchObj)
    }
  }
  public onChange2(args: any): void {
    let filter = [];
    if (this.typeObj.text === 'Groups') {
      filter.push({ columnName: 'group.name', value: this.searchObj.text });
    }
    if (this.typeObj.text === 'Teachers') {
      filter.push({ columnName: 'teacher.name', value: this.searchObj.text });
    }
    if (this.typeObj.text === 'Classrooms') {
      filter.push({ columnName: 'classroom.code', value: this.searchObj.text });
    }
    if (this.typeObj.text === 'Subjects') {
      filter.push({ columnName: 'subject.name', value: this.searchObj.text });
    }
    if (filter.length > 0) {
      this.scheduleCellService.getScheduleCellsByFilter(filter).subscribe(scheduleCells => {
        this.dataEvent.emit(scheduleCells);
      });
    }
  }
  ngOnInit() {
    this.groupService.getAllGroups().subscribe(groups => {
      this.groups = groups;
    })
    this.teacherService.getAllTeachers().subscribe(teachers => {
      this.teachers = teachers;
    })
    this.classroomService.getAllClassrooms().subscribe(classrooms => {
      this.classrooms = classrooms;
    })
    this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects;
    })
  }

  ngAfterViewInit(e: any) {
    setTimeout(() => {
      this.onChange1(e);
    }, 500)
  }
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.data, query);
  }
}
