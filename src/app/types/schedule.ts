import {ScheduleCell} from "./scheduleCell";

export interface Schedule {
  id: string;
  name: string;
  scheduleCells: ScheduleCell[];
}
