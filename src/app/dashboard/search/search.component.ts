import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DropDownListComponent} from "@syncfusion/ej2-angular-dropdowns";
import {Subject} from "../../types/subject";
import {GroupService} from "../../services/group.service";
import {TeacherService} from "../../services/teacher.service";
import {Group} from "../../types/group";
import {Teacher} from "../../types/teacher";
import {ClassroomService} from "../../services/classroom.service";
import {Classroom} from "../../types/classroom";
import {SubjectService} from "../../services/subject.service";
import {ScheduleCellService} from "../../services/schedule-cell.service";
import {ScheduleCell} from "../../types/scheduleCell";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, AfterViewInit {
  public lessonTypes: string[];
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
    {Id: 'Type1', Type: 'Groups'},
    {Id: 'Type2', Type: 'Teachers'},
    {Id: 'Type3', Type: 'Classrooms'},
    {Id: 'Type4', Type: 'Subjects'},
    {Id: 'Type5', Type: 'Lesson Types'},
  ];
  public fields: object = {text: 'Type', value: 'Id'};
  public dataFields: object = {value: 'Id', text: 'Name'};
  public searchValue: string;
  public typeValue: string

  constructor(private groupService: GroupService,
              private teacherService: TeacherService,
              private classroomService: ClassroomService,
              private subjectService: SubjectService,
              private scheduleCellService: ScheduleCellService) {
  }

  public onChange1(): void {
    if (this.typeValue) {
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
        this.searchValue = this.teachers.length > 0 ? this.teachers[0].id : '';
      }
      if (this.typeObj.text === 'Classrooms') {
        this.data = this.classrooms.map(classroom => {
          return {Id: classroom.id, Name: classroom.code};
        })
        this.searchValue = this.classrooms.length > 0 ? this.classrooms[0].id : '';
      }
      if (this.typeObj.text === 'Subjects') {
        this.data = this.subjects.map(subject => {
          return {Id: subject.id, Name: subject.name};
        })
        this.searchValue = this.subjects.length > 0 ? this.subjects[0].id : '';
      }
      if (this.typeObj.text === 'Lesson Types') {
        this.data = this.lessonTypes.map(type => {
          return {Id: type, Name: type};
        })
        this.searchValue = this.lessonTypes.length > 0 ? this.lessonTypes[0] : '';
      }
      this.searchObj.enabled = true;
    }

  }

  public onChange2(): void {
    let filter = [];

    if (this.typeObj.text === 'Groups') {
      filter.push({columnName: 'group.name', value: this.searchObj.text});
    }
    if (this.typeObj.text === 'Teachers') {
      filter.push({columnName: 'teacher.name', value: this.searchObj.text});
    }
    if (this.typeObj.text === 'Classrooms') {
      filter.push({columnName: 'classroom.id', value: this.searchObj.value});
    }
    if (this.typeObj.text === 'Subjects') {
      filter.push({columnName: 'subject.name', value: this.searchObj.text});
    }
    if (this.typeObj.text === 'Lesson Types') {
      filter.push({columnName: 'subject.type', value: this.searchObj.text});
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
    forkJoin({
      groups: this.groupService.getAllGroups(),
      teachers: this.teacherService.getAllTeachers(),
      classrooms: this.classroomService.getAllClassrooms(),
      subjects: this.subjectService.getAllSubjects()
    }).subscribe(({groups, teachers, classrooms, subjects}) => {
      this.groups = groups;
      this.teachers = teachers;
      this.classrooms = classrooms;
      this.subjects = subjects;
      this.loadLessonTypes();
      this.typeValue = 'Type1';
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onChange1();
    })
  }

}
