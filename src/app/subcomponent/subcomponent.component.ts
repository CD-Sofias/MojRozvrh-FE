import { Component, OnInit, Input } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-field-error-display',
  templateUrl: 'subcomponent.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['subcomponent.component.css']
})
export class FieldErrorDisplayComponent {

  @Input() errorMsg: string;
  @Input() displayError: boolean;

}
