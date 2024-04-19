import {ScheduleCell} from "./scheduleCell";

export interface Schedule {
  id: string;
  name: string;
  scheduleCells: ScheduleCell[];
}

export interface CreateSchedule {
  name: string;
  userId: string;
  scheduleCellIds: string[];
}
