import { Component } from '@angular/core';
import {GridModule} from '@syncfusion/ej2-angular-grids';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {AccordionModule} from "@syncfusion/ej2-angular-navigations";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import {DatePickerModule} from "@syncfusion/ej2-angular-calendars";
import {DropDownListModule} from "@syncfusion/ej2-angular-dropdowns";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {L10n, setCulture} from "@syncfusion/ej2-base";


@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    GridModule,
    AccordionModule,
    ButtonModule,
    DatePickerModule,
    DropDownListModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  public data: any[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    setCulture('custom');
    L10n.load({
      'custom': {
        'grid': {
          'EmptyRecord': 'Now there is not a single group'
        }
      }
    });

    this.http.get<any[]>(environment.backendUrl + '/groups').subscribe(data => {
      this.data = data;
    });
  }
  getGroupById(id: string): void {
    this.http.get<any>(environment.backendUrl + '/groups/' + id).subscribe(group => {
      this.data = group;
    });
  }
}
