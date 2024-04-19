import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GroupService} from "../../services/group.service";
import {ScheduleCell} from "../../types/scheduleCell";
import {ScheduleCellService} from "../../services/schedule-cell.service";
import {Schedule} from "../../types/schedule";


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent {
  public data: any[];
  public selectedGroup: any;
  public selectedGroupScheduleCells: ScheduleCell[] ;
  @Input() scheduleData = [];
  @Output() public selectedDataChanged = new EventEmitter<any>();

  constructor(private groupService: GroupService, private scheduleCellService: ScheduleCellService) {
  }

  ngOnInit(): void {
    this.groupService.getAllGroups().subscribe(data => {
      this.data = data;
    });
  }

  getGroupById(id: string): void {
    this.groupService.getGroupById(id).subscribe(group => {
      this.selectedGroup = group;
    });
  }


  onRowSelected(args: any): void {
    const groupId = args.data.id;
    this.getGroupById(groupId);
    this.scheduleCellService.getScheduleCellsByGroupId(groupId).subscribe(scheduleCells => {
      this.selectedGroupScheduleCells = Array.isArray(scheduleCells) ? [...scheduleCells] : [scheduleCells];

      this.selectedDataChanged.emit(this.scheduleData);

      this.scheduleData = this.selectedGroupScheduleCells.map(cell => {
        const startTime = new Date(cell.startTime);
        const endTime = new Date(cell.endTime);
        return {
          id: cell.id,
          subject_id: cell.subject.name,
          subject_type: cell.subject.type,
          teacher_id: cell.teacher.id,
          group_id: cell.group.name,
          classroom_id: cell.classroom.id,
          StartTime: startTime,
          EndTime: endTime,
          dayOfWeek: startTime.getDay(),
        };
      });

      this.selectedDataChanged.emit(this.scheduleData);
    });
  }
}
