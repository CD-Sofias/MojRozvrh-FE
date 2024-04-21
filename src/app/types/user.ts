import {Department} from "./department";
import {Schedule} from "./schedule";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  department?: Department;
  schedules: Schedule[];
}
