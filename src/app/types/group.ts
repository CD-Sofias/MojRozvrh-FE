import {Department} from "./department";

export interface Group {
  id: string;
  name: string;
  quantity: number;
  department?: Department
}

export interface CreateGroup {
  name: string;
  quantity: number;
  departmentId: string;
}
