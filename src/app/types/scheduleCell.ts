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

export interface ScheduleCellCreate {
  groupId: string;
  subjectId: string;
  teacherId: string;
  classroomId: string;
  scheduleId: string;
  startTime: Date;
  endTime: Date;
}
