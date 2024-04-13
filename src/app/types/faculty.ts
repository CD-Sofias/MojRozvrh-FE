import {Department} from "./department";

export interface Faculty {
    id: string;
    name: string;
    departments?: Department[];
}
