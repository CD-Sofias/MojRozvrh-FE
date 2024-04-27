import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {ScheduleService} from "./services/schedule.service";
import {Schedule} from "./types/schedule";


export const myScheduleResolver: ResolveFn<Schedule> = (route, state) => {
  return inject(ScheduleService).getScheduleById(route.params.id);
};
