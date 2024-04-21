import {ScheduleCell} from "./scheduleCell";

export interface Schedule {
  id: string;
  name: string;
  updatedAt: Date;
  scheduleCells: ScheduleCell[];
}

export interface CreateSchedule {
  name: string;
  userId: string;
  scheduleCellIds: string[];
}
