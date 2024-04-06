import {Component, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent {
  public data: any[];
  public selectedGroup: any;
  public selectedGroupScheduleCells: any[];
  public scheduleData: any[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      this.http.get<any[]>(environment.backendUrl + '/groups').subscribe(data => {
        this.data = data;
      });
    }


    getGroupById(id: string): void {
      this.http.get<any>(environment.backendUrl + '/groups/' + id).subscribe(group => {
        this.selectedGroup = group;
      });
    }

  onRowSelected(args: any): void {
    const groupId = args.data.id;
    this.getGroupById(groupId);
    this.getScheduleCellsByGroupId(groupId).subscribe(scheduleCells => {
      this.selectedGroupScheduleCells = [...scheduleCells];
      this.scheduleData = this.selectedGroupScheduleCells.map(cell => {
        const startTime = new Date(cell.startTime);
        const endTime = new Date(cell.endTime);
        return {
          id: cell.id,
          subject_id: cell.subject.name,
          subject_type: cell.subject.type,
          teacher_id: cell.teacher.name,
          group_id: cell.group.name,
          classroom_id: cell.classroom.name,
          StartTime: startTime,
          EndTime: endTime,
          dayOfWeek: startTime.getDay(),
        };
      });
    });
  }


    getScheduleCellsByGroupId(groupId: string): Observable<any> {
      return this.http.get<any>(environment.backendUrl + '/schedule_cell/group/' + groupId);
    }
}
