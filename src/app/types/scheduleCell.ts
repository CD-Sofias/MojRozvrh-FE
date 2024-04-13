import {Group} from "./group";
import {Teacher} from "./teacher";
import {Subject} from "./subject";
import {Classroom} from "./classroom";

export interface ScheduleCell {
  id: string;
  group: Group;
  subject: Subject;
  teacher: Teacher;
  classroom: Classroom;
  startTime: Date;
  endTime: Date;
}