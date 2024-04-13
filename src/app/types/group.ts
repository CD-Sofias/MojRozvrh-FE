import {Department} from "./department";

export interface Group {
  id: string;
  name: string;
  quantity: number;
  department?: Department
}
