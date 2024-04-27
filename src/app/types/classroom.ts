import {Address} from "./address";

export interface Classroom {
  id: string;
  type: string;
  addressId: string; // changed from address
  number: number;
  capacity: number;
  code: string;
}

export interface CreateClassroom {
  capacity: number;
  type: string;
  number: number;
  addressId: string;
}
