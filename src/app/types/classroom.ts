import {Address} from "./address";

export interface Classroom {
  id: string;
  type: string;
  capacity: number;
  number: number;
  address: Address;
  code: string;
}
