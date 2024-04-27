import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AccordionAllModule} from "@syncfusion/ej2-angular-navigations";
import {DropDownListModule, DropDownListComponent, FilteringEventArgs} from "@syncfusion/ej2-angular-dropdowns";
import {DatePickerAllModule, DatePickerComponent, DatePickerModule} from "@syncfusion/ej2-angular-calendars";
import {DataManager, Predicate, Query, ReturnOption} from "@syncfusion/ej2-data";
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
import {DashboardModule} from "../dashboard.module";
import {View} from "@syncfusion/ej2-angular-schedule";
import {ScheduleComponent} from "../schedule/schedule.component";
import {group} from "@angular/animations";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private groupService: GroupService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private subjectService: SubjectService,
              private scheduleCellService: ScheduleCellService) {
  }
  @Input() scheduleData: ScheduleCell;
  @ViewChild('scheduleObj') public scheduleObj!: ScheduleComponent;
  @ViewChild('subject_id') public subjectId!: DropDownListComponent;
  @ViewChild('classroom_id_search_content') public classroomIdSearchContent!: DropDownListComponent;
  @ViewChild('startTime_search_content') public startTimeObj!: DatePickerComponent;
  @ViewChild('endTime_search_content') public endTimeObj!: DatePickerComponent;
  @ViewChild('eventTypeSearch') public eventTypeSearch!: DropDownListComponent;

  public lessonTypes: string[];

  @ViewChild('teacher_id') public teacherId!: DropDownListComponent;

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
    { Id: 'Type5', Type: 'Lesson Types' },
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
        this.searchValue = this.groups.length > 0 ? this.groups[0].id : '';
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
      if (this.typeObj.text === 'Lesson Types') {
        this.data = this.lessonTypes.map(type => {
          return {Id: type, Name: type};
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
    this.dataEvent.emit([]);

    if (this.typeObj.text === 'Groups') {
      filter.push({ columnName: 'group.name', value: this.searchObj.text });
    }
    if (this.typeObj.text === 'Teachers') {
      filter.push({ columnName: 'teacher.name', value: this.searchObj.text });
    }
    if (this.typeObj.text === 'Classrooms') {
      filter.push({ columnName: 'classroom.id', value: this.searchObj.value });
    }
    if (this.typeObj.text === 'Subjects') {
      filter.push({ columnName: 'subject.name', value: this.searchObj.text });
    }
    if (this.typeObj.text === 'Lesson Types') {
      filter.push({ columnName: 'subject.type', value: this.searchObj.text });
    }
    if (filter.length > 0) {
      this.scheduleCellService.getScheduleCellsByFilter(filter).subscribe(scheduleCells => {
        this.dataEvent.emit(scheduleCells);
      });
    }
  }

  public loadLessonTypes(): void {
    this.lessonTypes = [...new Set(this.subjects.map(subject => subject.type))];
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
      this.loadLessonTypes();
    })
  }
  ngAfterViewInit(e: any) {
    setTimeout(() => {
      this.onChange1(e);
    }, 500)
  }
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
    e.updateData(this.data, query);
  }

}
