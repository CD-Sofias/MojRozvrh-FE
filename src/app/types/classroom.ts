import {Address} from "./address";

export interface Classroom {
  id: string;
  type: string;
  address: Address;
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

export interface EditClassroom {
  id: string;
  type: string;
  addressId: string;
  number: number;
  capacity: number;
  code: string;
}
