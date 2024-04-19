import {ChangeDetectionStrategy, Component, OnInit, Output} from '@angular/core';
import {Subject} from "../types/subject";
import {SubjectService} from "../services/subject.service";
import {Schedule} from "../types/schedule";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  public scheduleData: Schedule[] = [];

  constructor(private subjectService: SubjectService) {
    this.loadSubjects();
  }

  ngOnInit(): void {
    console.log(this.scheduleData)
  }

  subjects: Subject[] = [];


  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects.map(subject => {
        return {
          id: subject.id,
          name: subject.name,
          type: subject.type,
          color: subject.type === 'Lecture' ? '#ffaa00' : subject.type === 'Practice' ? '#357cd2' : '#7fa900'
        };
      })
    });
  }
}
