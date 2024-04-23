import {Department} from "./department";

export interface Group {
  name: string;
  quantity: number;
  department?: {
    id: string;
    name: string;
  };
}

export interface CreateGroup {
  name: string;
  quantity: number;
  departmentId: string;
}
