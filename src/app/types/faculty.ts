import {Department} from "./department";

export interface Faculty {
    id: number;
    name: string;
    departments?: Department[];
}
