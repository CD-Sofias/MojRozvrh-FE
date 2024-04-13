import {Department} from "./department";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  department?: Department;
}
